export const DeviceCard = ({data, extraFunctionality}) => (
    <div style={{border: "2px solid white", borderRadius: "4%", margin: '5px', padding: "10px"}}>
    <h3>{data.name}</h3>
    <p>Type: {data.type}</p>
    {extraFunctionality}
</div>)