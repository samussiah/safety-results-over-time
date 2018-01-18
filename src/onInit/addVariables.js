export default function addVariables() {
    this.raw_data.forEach(d => {
        d.NONE = 'All Participants'; // placeholder variable for non-grouped comparisons
    });
}
