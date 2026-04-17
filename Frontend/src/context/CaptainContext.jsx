import React, { createContext } from 'react'

export const CaptainDataContext = createContext();

function CaptainContext({ children }) {
    const [captain, setCaptain] = React.useState({
        email: "",
        fullName: {
            firstName: "",
            lastName: ""
        },
        vehicle: {
            color: "",
            plate: "",
            capacity: "",
            vehicleType: ""
        }
    });

    return (
        <div>
            <CaptainDataContext.Provider value={{ captain, setCaptain }}>
                {children}
            </CaptainDataContext.Provider>
        </div>
    )
}

export default CaptainContext
