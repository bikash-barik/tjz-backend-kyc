const axios = require('axios');

async function handleApiResponse(apiFunction, ...args) {
    try {
        const response = await apiFunction(...args);
        return {
            status: true,
            message: "Sent successfully", // Assuming SMS sent successfully, you can change this based on your actual logic
            data: response.data,
        };
    } catch (error) {
        return {
            status: false,
            message: error.message,
            data: [],
        };
    }
}

async function photoVerify(liveImage1, liveImage2, idPhoto) {
    if (!liveImage1 || !liveImage2 || !idPhoto) {
        throw new Error("Insufficient Data");
    }

    const requestBody = {
        liveimage1: liveImage1,
        liveimage2: liveImage2,
        idphoto: idPhoto,
    };

    return handleApiResponse(axios.post, "https://bws.bioid.com/extension/photoverify", requestBody, {
        headers: {
            Authorization: `Basic OWZiYWYzZWUtMzliZC00M2U0LWI0NjQtN2I3MTBlY2RmMzAzOms5QWFjNU5rMjN3aElaRWZiMTMzMCtuWg==`,
            "Content-Type": "application/json",
        },
    });
}

async function extractPassportInfo(idPhoto) {
    const requestBody = {
        task_id: "74f4c926-250c-43ca-9c53-453e87ceacd1",
        group_id: "8e16424a-58fc-4ba4-ab20-5bc8e7c3c41e",
        data: {
            document1: idPhoto,
            doc_type: "international_passport",
        },
    };

    return handleApiResponse(axios.post, "https://eve.idfy.com/v3/tasks/sync/extract/id_document", requestBody, {
        headers: {
            "Content-Type": "application/json",
            "account-id": "c4c679e57222/20d54335-4ddf-463b-874c-9b5fa2a5bed8",
            "api-key": "601e8b1a-d988-4651-8294-ebf0e01d01a8",
        },
    });
}

module.exports = {
    photoVerify,
    extractPassportInfo,
};
