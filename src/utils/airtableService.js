const airtableApiUrl = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}`;

export const fetchRecords = async (tableName, filterParams, sortField, sortDirection, maxRecords) => {
    try {
        // Construct the URL with query parameters
        const url = new URL(`${airtableApiUrl}/${tableName}`);
        const params = new URLSearchParams();

        // Add the filterByFormula parameter
        if (filterParams) {
            params.append('filterByFormula', filterParams);
        }

        // Add the sort parameters
        // if (sortField && sortDirection) {
        //     params.append('sort[0][field]', sortField);
        //     params.append('sort[0][direction]', sortDirection);
        // }

        // // Add the maxRecords parameter if specified
        // if (maxRecords) {
        //     params.append('maxRecords', maxRecords);
        // }

        // Append the constructed parameters to the URL
        url.search = params.toString();

        // Fetch the records
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY_PUBLIC}`,
                'Content-Type': 'application/json',
            },
        });
        // const response = await fetch(`${airtableApiUrl}/${tableName}`, {
        //     method: 'GET',
        //     headers: {
        //         Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY_PUBLIC}`,
        //         'Content-Type': 'application/json',
        //     },
        //     params: {
        //         filterByFormula: filterParams,
        //         sort: [{ field: sortField, direction: sortDirection }],
        //         maxRecords,
        //     },
        // });
        console.log(response);

        if (!response.ok) {
            throw new Error(`Error fetching records: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.records;
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error;
    }
};

export const fetchSingleRecord = async (tableName, id, method, bodyData) => {
    try {
        const response = await fetch(`${airtableApiUrl}/${tableName}/${id}`, {
            method: method ? method : 'GET',
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY_PRIVATE}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
            throw new Error(`Error fetching records: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error;
    }
};

export const CrudRecords = async (tableName, method, bodyData) => {
    try {
        const response = await fetch(`${airtableApiUrl}/${tableName}`, {
            method: method,
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_KEY_PRIVATE}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
        });

        if (!response.ok) {
            throw new Error(`Error fetching records: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.records;
    } catch (error) {
        console.error('Error fetching records:', error);
        throw error;
    }
};