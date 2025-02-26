const missionService = require("../services/missionService");

const create = async(req, res)=>{
    try{
        const { name, type, description, pionts } = req.body;
        const newMission = await missionService.createMission(name, type, description, pionts);
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

const getMissionById = async(req,res) =>{
    try{
        const getById = await missionService.getMissionByID(req.params.id);
        if(!getById) return res.status(400).json({error: error.message});
        res.json(getById);
    } catch (error){
        res.status(500).json({error: error.message})
    }
};


module.exports ={
    create, update, deleteMission, getMissionById
}

