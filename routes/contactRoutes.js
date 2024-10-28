import express from 'express';
import { addContact, bulkUploadContacts, getContacts } from '../controllers/contactController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post("/contacts/addcontact",addContact)
router.get('/contacts/getcontacts',getContacts)
router.post('/contacts/bulk-upload', upload.single('file'), bulkUploadContacts);

export default router;
