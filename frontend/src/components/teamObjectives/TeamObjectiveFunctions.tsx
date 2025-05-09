export async function FetchKeyStrategies() {
    try {
        console.log('Fetching key strategies...');
        const response = await fetch('http://localhost:5000/api/strategiat');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Response received:', response);
        const data = await response.json();
        //alert('Key strategies fetched successfully!');
        return data;
    } catch (error) {
        console.error('Error fetching key strategies:', error);
        throw error;
    }
}