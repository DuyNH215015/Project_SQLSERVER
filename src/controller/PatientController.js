import PatientService from "../services/PatientService"

let handlegetAllPatients = async (req, res) => {
    let id = req.query.id; // truyền All, id
    raw: true;
    if(!id){
        return res.status(200).json({
        errCode: 1,
        errMessage: 'Missing required parameters',
        users: []
    })
    }
    let users = await PatientService.getAllPatients(id);
    
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

let handleCreateNewPatient = async (req, res) =>{
    let message = await PatientService.createNewPatient(req.body);
    console.log(message);
    return res.status(200).json(message)
    
}

let handleEditPatient = async (req, res) =>{
    let data = req.body;
    let message = await PatientService.updatePatientData(data);
    return res.status(200).json(message);
}
let handleDeletePatient = async (req, res) =>{
    if(!req.body.id){
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
        })
    }
    let message = await PatientService.deleteUser(req.body.id);
    return res.status(200).json(message);
}
module.exports ={
    handlegetAllPatients: handlegetAllPatients,
    handleCreateNewPatient: handleCreateNewPatient,
    handleEditPatient: handleEditPatient,
    handleDeletePatient: handleDeletePatient,
}