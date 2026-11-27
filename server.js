import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = fs.existsSync(path.join(__dirname, "public")) ? __dirname : path.join(__dirname, "..");
const app = express();
const PORT = Number(process.env.PORT) || Number(process.env.CMS_SERVER_PORT) || 5e3;
app.use(cors());
app.use(express.json({ limit: "50mb" }));
const uploadDir = path.join(rootDir, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + ext);
  }
});
const upload = multer({ storage });
const fallbackFilePath = path.join(rootDir, "server", "cms_fallback_data.json");
function loadFallbackData() {
  if (fs.existsSync(fallbackFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(fallbackFilePath, "utf8"));
    } catch {
    }
  }
  return { seo: {}, sections: {}, assets: [] };
}
function saveFallbackData(data) {
  fs.writeFileSync(fallbackFilePath, JSON.stringify(data, null, 2), "utf8");
}
let fallbackData = loadFallbackData();
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  port: Number(process.env.DB_PORT) || 3306
};
const DB_NAME = process.env.DB_NAME || "august_aurea_cms";
let pool = null;
let isMysqlConnected = false;
async function initDB() {
  try {
    pool = mysql.createPool({
      ...dbConfig,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    const testConn = await pool.getConnection();
    await testConn.ping();
    testConn.release();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pages_seo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_key VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        canonical_path VARCHAR(255),
        og_image VARCHAR(500),
        keywords VARCHAR(500),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_key VARCHAR(50) NOT NULL,
        section_key VARCHAR(100) NOT NULL,
        section_name VARCHAR(255),
        content JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_page_section (page_key, section_key)
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS media_assets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        url VARCHAR(500) NOT NULL,
        size INT,
        mimetype VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    isMysqlConnected = true;
    console.log(`[CMS] Live MySQL database '${DB_NAME}' connected successfully.`);
  } catch (err) {
    isMysqlConnected = false;
    console.log(`[CMS] Notice: MySQL unavailable (${err.message}). Using persistent local fallback storage.`);
  }
}
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: isMysqlConnected ? "mysql" : "local_persistent_storage",
    db_name: DB_NAME,
    timestamp: /* @__PURE__ */ new Date()
  });
});
app.get("/api/seo", async (_req, res) => {
  if (isMysqlConnected && pool) {
    try {
      const [rows] = await pool.query("SELECT * FROM pages_seo");
      return res.json(rows);
    } catch (error) {
      console.error("MySQL query error:", error);
    }
  }
  const list = Object.values(fallbackData.seo);
  res.json(list);
});
app.get("/api/seo/:pageKey", async (req, res) => {
  const { pageKey } = req.params;
  if (isMysqlConnected && pool) {
    try {
      const [rows] = await pool.query("SELECT * FROM pages_seo WHERE page_key = ?", [pageKey]);
      if (rows.length > 0) return res.json(rows[0]);
    } catch (error) {
      console.error("MySQL query error:", error);
    }
  }
  res.json(fallbackData.seo[pageKey] || null);
});
app.post("/api/seo", async (req, res) => {
  const { page_key, title, description, canonical_path, og_image, keywords } = req.body;
  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `
        INSERT INTO pages_seo (page_key, title, description, canonical_path, og_image, keywords)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          description = VALUES(description),
          canonical_path = VALUES(canonical_path),
          og_image = VALUES(og_image),
          keywords = VALUES(keywords);
      `,
        [page_key, title, description, canonical_path, og_image, keywords]
      );
    } catch (error) {
      console.error("MySQL query error:", error);
    }
  }
  fallbackData.seo[page_key] = {
    page_key,
    title,
    description,
    canonical_path,
    og_image,
    keywords,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  saveFallbackData(fallbackData);
  res.json({ success: true, message: "SEO settings saved." });
});
app.get("/api/sections", async (_req, res) => {
  if (isMysqlConnected && pool) {
    try {
      const [rows] = await pool.query("SELECT * FROM content_sections ORDER BY page_key, section_key");
      const sections = {};
      for (const row of rows) {
        if (!sections[row.page_key]) {
          sections[row.page_key] = {};
        }
        sections[row.page_key][row.section_key] = typeof row.content === "string" ? JSON.parse(row.content) : row.content;
      }
      return res.json({ list: rows, map: sections });
    } catch (error) {
      console.error("MySQL query error:", error);
    }
  }
  res.json({ list: [], map: fallbackData.sections });
});
app.post("/api/sections", async (req, res) => {
  const { page_key, section_key, section_name, content } = req.body;
  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `
        INSERT INTO content_sections (page_key, section_key, section_name, content)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          section_name = VALUES(section_name),
          content = VALUES(content);
      `,
        [page_key, section_key, section_name || section_key, JSON.stringify(content)]
      );
    } catch (error) {
      console.error("MySQL query error:", error);
    }
  }
  if (!fallbackData.sections[page_key]) {
    fallbackData.sections[page_key] = {};
  }
  fallbackData.sections[page_key][section_key] = content;
  saveFallbackData(fallbackData);
  res.json({ success: true, message: `Section '${section_key}' updated.` });
});
app.post("/api/sections/batch", async (req, res) => {
  const { items } = req.body;
  if (isMysqlConnected && pool) {
    try {
      for (const item of items) {
        await pool.query(
          `
          INSERT INTO content_sections (page_key, section_key, section_name, content)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            section_name = VALUES(section_name),
            content = VALUES(content);
        `,
          [item.page_key, item.section_key, item.section_name || item.section_key, JSON.stringify(item.content)]
        );
      }
    } catch (error) {
      console.error("MySQL batch error:", error);
    }
  }
  for (const item of items) {
    if (!fallbackData.sections[item.page_key]) {
      fallbackData.sections[item.page_key] = {};
    }
    fallbackData.sections[item.page_key][item.section_key] = item.content;
  }
  saveFallbackData(fallbackData);
  res.json({ success: true, count: items.length });
});
app.get("/api/assets", async (_req, res) => {
  if (isMysqlConnected && pool) {
    try {
      const [rows] = await pool.query("SELECT * FROM media_assets ORDER BY created_at DESC");
      return res.json(rows);
    } catch (error) {
      console.error("MySQL query error:", error);
    }
  }
  res.json(fallbackData.assets);
});
app.post("/api/assets/upload", upload.array("files", 10), async (req, res) => {
  try {
    const files = req.files;
    const uploaded = [];
    for (const file of files) {
      const fileUrl = `/uploads/${file.filename}`;
      let id = Date.now() + Math.floor(Math.random() * 1e3);
      if (isMysqlConnected && pool) {
        try {
          const [result] = await pool.query(
            "INSERT INTO media_assets (filename, original_name, url, size, mimetype) VALUES (?, ?, ?, ?, ?)",
            [file.filename, file.originalname, fileUrl, file.size, file.mimetype]
          );
          id = result.insertId;
        } catch (err) {
          console.error("MySQL insert asset error:", err);
        }
      }
      const assetRecord = {
        id,
        filename: file.filename,
        original_name: file.originalname,
        url: fileUrl,
        size: file.size,
        mimetype: file.mimetype,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      uploaded.push(assetRecord);
      fallbackData.assets.unshift(assetRecord);
    }
    saveFallbackData(fallbackData);
    res.json({ success: true, files: uploaded });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});
app.delete("/api/assets/:id", async (req, res) => {
  const assetId = Number(req.params.id);
  if (isMysqlConnected && pool) {
    try {
      await pool.query("DELETE FROM media_assets WHERE id = ?", [assetId]);
    } catch (err) {
      console.error("MySQL delete asset error:", err);
    }
  }
  const idx = fallbackData.assets.findIndex((a) => a.id === assetId);
  if (idx !== -1) {
    const file = fallbackData.assets[idx];
    const filePath = path.join(uploadDir, file.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
      }
    }
    fallbackData.assets.splice(idx, 1);
    saveFallbackData(fallbackData);
  }
  res.json({ success: true, message: "Asset deleted" });
});
const publicDir = path.join(rootDir, "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
}
const distDir = path.join(rootDir, "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(distDir, "index.html"));
  });
}
app.listen(PORT, () => {
  console.log(`[CMS] Backend server running on port ${PORT}`);
});
initDB();
