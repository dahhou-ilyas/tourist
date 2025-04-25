import MapComponent from "@/component/MapComponent"
//on doit maintenant de ajouté les palce selection coté admine et aussi dans le coté admine on doit le montioné les place déja
//selectionné a fin de ne pas selection la meme chose
//aussu coté de frontend mobile on doit traker le user et l'afficher les place dangeruer qui sont dans un distance de 
// 1 km de distance sahcant que user et le centre de disk de rayon 1km

const MapPage:React.FC = ()=>{
    return <>
        <MapComponent/>
    </>
}

export default MapPage;