import Contact from '../models/contact.js';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { validateContact } from '../utils/validation.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';


export const addContact = async (req, res) => {
  try {
    const { name, email, phone, address, timezone } = req.body;
    const contact = await Contact.create({ name, email, phone, address, timezone });
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getContacts = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const contacts = await Contact.findAll({ where: whereClause });
    res.json(contacts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const bulkUploadContacts = async (req, res) => {
  const filePath = path.join('uploads', req.file.filename);
  const isCSV = req.file.mimetype === 'text/csv';
  let contacts = [];

  try {
    if (isCSV) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      contacts = Papa.parse(fileContent, { header: true }).data;
    } else {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header
          const [name, email, phone, address, timezone] = row.values.slice(1);
          contacts.push({ name, email, phone, address, timezone });
        }
      });
    }

    contacts = contacts.filter(contact => validateContact(contact));

    await sequelize.transaction(async (transaction) => {
      await Contact.bulkCreate(contacts, { transaction });
    });

    res.status(201).json({ message: 'Contacts uploaded successfully' });
  } catch (error) {
    res.status(500).json({
      error: 'File parsing or data insertion failed',
      details: error.message,
    });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete uploaded file:', err.message);
    });
  }
};
