
import { useState } from 'react';
import { json } from 'sequelize';
const {upload} = require("../")

const UploadEvidence = () => {
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files)); // Convierte FileList en un array
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!description || !files || files.length === 0) {
            setMessage('Debe proporcionar una descripción y al menos un archivo.');
            return;
        }

        const formData = new FormData();
        formData.append('description', description);
        files.forEach(file => formData.append('files', file));

        try {
            const token = localStorage.getItem('token'); 

            const response = await fetch('http://localhost:4000/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Agrega el token en el header
                },
                body: formData,
            });

            let data;
            try {
                data = await response.json();
               
            } catch {
                data = { message: 'Error al procesar la respuesta del servidor' };
            }

            if (response.ok) {
                setMessage('Evidencia subida con éxito');
                setDescription('');
                setFiles([]); // Reinicia correctamente
            } else {
                setMessage(data.message || 'Error al subir la evidencia');
            }
        } catch (error) {
            setMessage('Error de conexión con el servidor');
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Subir Evidencia</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-2">
                    <label className="block text-sm font-medium">Descripción:</label>
                    <input 
                        type="text" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium">Seleccionar archivos:</label>
                    <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border rounded-md" />
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Subir</button>
            </form>
            {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
        </div>
    );
};

export default UploadEvidence;
