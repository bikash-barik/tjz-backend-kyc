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
            "account-id": "0b84d9bb671d/6d029600-54e6-4b6f-a2bc-0f28172364fd",
            "api-key": "e674aadb-89c2-441d-8b4b-a2ad1189e3d1",
        },
    });
}

module.exports = {
    photoVerify,
    extractPassportInfo,
};
