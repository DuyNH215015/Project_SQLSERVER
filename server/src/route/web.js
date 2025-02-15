import express from 'express';
import homeController from '../controller/homeController';
import LoginController from '../controller/LoginController';
import PatientController from '../controller/PatientController';
import DoctorController from '../controller/DoctorController';
import BookingController from '../controller/BookingController';
import db, { sequelize } from '../models/index';
var storage = require('node-persist');
let router = express.Router();

let initWebRoutes = (app) => {
  app.use(express.json());

  // function isLoggedIn(req,res,next)
  // {
  //     if (req.session.userId)
  //         next();
  //     else res.redirect('/api/login');
  // }
  router.get('/', homeController.getHomePage);
  router.get('/about', homeController.getAboutPage);

  //***************ADMIN****************

  router.get('/crud', homeController.getCRUD); //render ra form create patient
  router.post('/post-crud', homeController.postCRUD); //created
  router.get('/get-crud', homeController.displayGetCRUD); //in ra màn hình patient
  router.get('/edit-crud', homeController.getEditCRUD); //edit
  router.post('/put-crud', homeController.putCRUD); //edit xong thì sẽ chuyển
  router.get('/delete-crud', homeController.deleteCRUD); //delete
  router.post('/api/login', LoginController.handleLogin); //login
  router.post('/api/log-out', async (req, res) => {
    console.log('before', req.session);
    await delete req.session.userId;
    await delete req.session.roleId;
    console.log('after', res.session);
    res.send('logged out');
  });
  //***************PATIENT***************

  router.get('/api/get-all-patients', PatientController.handlegetAllPatients); //print all patients

  router.get('/api/patient/info', PatientController.handlegetOnePatient); //print a ptient
  router.post('/api/patient-sign-up', PatientController.handleCreateNewPatient); // patient signup
  router.put('/api/edit-patient', PatientController.handleEditPatient); // edit a patient
  router.put(
    '/api/change-patient-password',
    PatientController.handleChangePassword
  ); // change patient password
  router.delete('/api/delete-patient', PatientController.handleDeletePatient); // delete a patient (might be delete if it's not useful)

  //***************DOCTOR***************

  router.get('/api/get-all-doctors', DoctorController.handlegetAllDoctors); //print all doctors

  router.get('/api/doctor/info', DoctorController.handlegetOneDoctor); //print a ptient
  router.post('/api/doctor-sign-up', DoctorController.handleCreateNewDoctor); // this appears to manual create a new doctor in backend
  router.put('/api/edit-doctor', DoctorController.handleEditDoctor); // edit a doctor
  router.put(
    '/api/change-doctor-password',
    DoctorController.handleChangePassword
  ); // change patient password
  router.delete('/api/delete-doctor', DoctorController.handleDeleteDoctor); // delete a doctor (might be delete if it's not useful)

  //***************BOOKING***************

  //   router.get('/api/patient-booking', BookingController.handleBooking_1); // render frontend select clinic
  //   router.post('/api/booking-state-clinic', BookingController.postBooking_clinic); // save clinicId and redirect to /api/patient-booking-specialization

  //   router.get('/api/patient-booking-specialization', BookingController.handleBooking_2); // render frontend select specialization
  //   router.post('/api/booking-state-specialization', BookingController.postBooking_specialization); // save specializationId and redirect to /api/patient-booking-doctor

  //   router.get('/api/patient-booking-doctor', BookingController.handleBooking_3); // render frontend select doctor, date and time
  //   router.post('/api/booking-state-complete', BookingController.postBooking_doctor); // result of booking

  // test frontend style booking
  router.get('/api/booking', async (req, res) => {
    let clinicData = await db.Clinic.findAll({
      raw: true,
    });
    let specializationData = await db.Specialization.findAll({
      raw: true,
    });
    res.send({ clinic: clinicData, specialization: specializationData });
  });
  router.post('/api/booking/doctor', async (req, res) => {
    let doctorData = await db.Doctor.findAll({
      where: {
        SpecializationId: req.body.sid,
        ClinicId: req.body.cid,
      },
      raw: true,
    });
    res.send({ doctor: doctorData });
  });

  router.post('/api/booking/done', BookingController.postBooking);

  router.get('/api/get-session', async (req, res) => {
    let response = 'userId' in req.session ? req.session.userId : 'failed';
    let responseStr = 'userId' in req.session ? response.toString() : response;
    console.log(responseStr);
    res.send(responseStr);
  });

  router.get('/api/profile/patient/:id', async (req, res) => {
    let userId = req.params.id;
    let data = await db.Patient.findOne({
      raw: true,
      where: {
        id: userId,
      },
      attributes: [
        'email',
        'Patient_lastName',
        'Patient_firstName',
        'Patient_address',
        'Patient_gender',
        'Patient_age',
        'Patient_phoneNumber',
      ],
    });
    console.log(data);
    res.send({ data: data });
  });
  router.get('/api/profile/doctor/:id', async (req, res) => {
    let userId = req.params.id;
    let data = await db.Doctor.findOne({
      raw: true,
      where: {
        id: userId,
      },
      attributes: [
        'email',
        'Doctor_lastName',
        'Doctor_firstName',
        'Doctor_address',
        'Doctor_gender',
        'Doctor_age',
        'Doctor_phoneNumber',
      ],
    });
    console.log(data);
    res.send({ data: data });
  });

  router.get('/api/booking/patient/:id', async (req, res) => {
    let userId = req.params.id;
    let bookData = await db.sequelize.query(
      'select bookings.id,h.StatusId,doctors.Doctor_firstName,f.Doctor_lastName,a.Clinic_name,b.Clinic_address,g.date,c.valueEn as time,d.valueEn as status from bookings inner join bookings h on h.id = bookings.id inner join doctors on doctors.id = bookings.DoctorId inner join doctors as f on doctors.id = f.id inner join clinics a on a.id = doctors.ClinicId inner join clinics b on b.id = doctors.ClinicId inner join bookings g on g.id = bookings.id inner join allcodes c on c.id = bookings.timeType inner join allcodes d on d.id = bookings.StatusId where bookings.PatientId = ' +
        userId +
        ' ORDER by h.StatusId asc , bookings.id asc',
      { type: db.sequelize.QueryTypes.SELECT }
    );
    console.log(bookData);
    res.send({ data: bookData });
  });

  router.get('/api/test/:id', async (req, res) => {
    let userId = req.params.id;
    let data = await db.sequelize.query(
      'select bookings.id,h.StatusId,doctors.Doctor_firstName,f.Doctor_lastName,a.Clinic_name,b.Clinic_address,g.date,c.valueEn,d.valueEn from bookings inner join bookings h on h.id = bookings.id inner join doctors on doctors.id = bookings.DoctorId inner join doctors as f on doctors.id = f.id inner join clinics a on a.id = doctors.ClinicId inner join clinics b on b.id = doctors.ClinicId inner join bookings g on g.id = bookings.id inner join allcodes c on c.id = bookings.timeType inner join allcodes d on d.id = bookings.StatusId where bookings.PatientId = ' +
        userId +
        ' ORDER by h.StatusId asc , bookings.id asc',
      { type: db.sequelize.QueryTypes.SELECT }
    );
    res.send({ data: data });
  });

  router.get('/api/booking/doctor/:id', async (req, res) => {
    let userId = req.params.id;
    let bookData = await db.Booking.findAll({
      raw: true,
      where: {
        doctorId: userId,
      },
      attributes: [
        'id',
        'statusId',
        'doctorId',
        'PatientId',
        'date',
        'timeType',
      ],
    });
    res.send({ data: bookData });
  });

  //*****************APP*****************
  router.get(
    '/api/home/specialization',
    homeController.getSpecializationToHome
  );

  return app.use('/', router);
};

module.exports = initWebRoutes;
