const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 4500;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

//Database
mongoose.connect('mongodb+srv://ok7technicalservices:mNjzS3Rw0T3p7DGY@cluster0.qfhw35c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

const detailsSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  role: String,
  resumeLink: String
});

const Details = mongoose.model('Details', detailsSchema);


//Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post('/api/save-details', upload.single('resume'), async (req, res) => {
  const { firstName,lastName,email,mobile,role } = req.body;
  const resumeLink = req.file.path;
  // const newDetails = new Details({ firstName,lastName,email,mobile,role });
  const newDetails = new Details({ firstName,lastName,email,mobile,role,resumeLink });
  await newDetails.save();
  res.json({ message: 'Details saved successfully' });
});

app.post('/get-all',async(req,res) => {
    const data = await Details.find({});
    return res.json(data);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});