"use server"
const baseUrl = "http://localhost:5000";
export const getAllProperty = async (allproperties) => {
   const res = await fetch(`${baseUrl}/api/properties`, 
            {method: "POST", 
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify(allproperties)
});

return res.json();
    }