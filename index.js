const fs = require('fs');
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

const uploadDirectory = 'uploads';
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}


//Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory + '/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });


app.get("/", (req, res) =>{res.json("yo")})

// app.post('/api/save-details', upload.single('resume'), async (req, res) => {
//   try
//   {
//   const { firstName,lastName,email,mobile,role } = req.body;
//   const resumeLink = req.file.path;
//   // const newDetails = new Details({ firstName,lastName,email,mobile,role });
//   const newDetails = new Details({ firstName,lastName,email,mobile,role,resumeLink });
//   await newDetails.save();
//   res.json({ message: 'Details saved successfully' });
//   }catch(error)
//   {
//     return res.status(500).json({message: error.message});
//   }
// });

app.post('/api/save-details', upload.single('resume'), async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, role } = req.body;

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the file path
    const resumeLink = req.file.path;

    // Create a new Details object
    const newDetails = new Details({ firstName, lastName, email, mobile, role, resumeLink });

    // Save the details to the database
    await newDetails.save();

    // Respond with success message
    res.json({ message: 'Details saved successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error saving details:', error);
    return res.status(500).json({ message: 'An error occurred while saving details' });
  }
});

app.post('/get-all',async(req,res) => {
    const data = await Details.find({});
    return res.json(data);
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});