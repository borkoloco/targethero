const missionService = require("../services/missionService");

const create = async(req, res)=>{
    try{
        const { name, type, description, pionts,status } = req.body;
        const newMission = await missionService.createMission(name, type, description, pionts,status);
        res.status(201).json(newMission);
    } catch(error){
        res.status(400).json({error: error.message})
    }
};

const update = async(req, res)=>{
    try{
        const updateMission = await missionService.updateMission(req.params.id, req.body);
        res.json(updateMission);
    } catch (error){
        res.status(400).json({ error: error.message})
    }
};

const deleteMission = async(req,res) =>{
    try{
        const result = await missionService.deleteMission(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
};

const getAllMission = async(req,res) =>{
      try {
        const users = await missionService.getAllMission();
        res.json(users);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
};


module.exports ={
    create, update, deleteMission, getAllMission
}

