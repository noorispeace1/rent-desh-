"use server"
const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;
export const getAllProperty = async (allproperties) => {
   const res = await fetch(`${baseUrl}/api/properties`, 
            {method: "POST", 
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify(allproperties)
});

return res.json();
    }