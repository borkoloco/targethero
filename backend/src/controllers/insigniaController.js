const insigniasService = require("../services/insigniasService");


const createInsignia = async(req,res) =>{
    try{

    const { name,logoUrl,type,description } = req.body;
    const newInsignia = await insigniasService.createInsignia(
        name,
        logoUrl,
        type,
        description,
    );

    res.status(201).json(newInsignia);
} catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const updateInsignia = async (req, res) => {
  try {
    const updatedInsignia = await insigniasService.updateInsignia(
      req.params.id,
      req.body
    );
    res.json(updatedInsignia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteInsignia = async (req, res) => {
  try {
    const result = await insigniasService.deleteInsignia(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllInsignia = async (req, res) => {
  try {
    const insgnia = await insigniasService.getAllInsignia();
    res.json(insgnia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getInsiniaByID = async(req, res)=>{
    try {
        const insgnia = await insigniasService.getInsiniaByID();
        res.json(insgnia);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }

};


module.exports = {
    createInsignia,
    updateInsignia,
    deleteInsignia,
    getAllInsignia,
    getInsiniaByID,
};