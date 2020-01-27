import React, {Component} from 'react';
import {Container, Row, Col, Button, Collapse} from 'reactstrap';
import '../../App.css';
import ImageBox from "../../utils/ImageBox/ImageBox";
import MiniPin from "../../utils/MiniPin/MiniPin";
import NavHeader from '../../utils/NavHeader/NavHeader';
import './HomePage.css';
import * as firebase from "firebase";
import StarRatings from 'react-star-ratings';
import heart from './heart.png'
import heartSaved from './heartSaved_1.png'
import  TripCard from './TripCard'

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            targetId: null,
            loaded: false,
            pinsLoaded: false,
            popularTrips: [],
            nearTrips: [],
            recommendedTrips: [],
            exploreTrips: [],
            expensiveTrips: [],
            cheapTrips: [],
            targetRate: 0,
            pins: {}
        };
    }

    componentDidMount() {
        const db = firebase.firestore();
        let popQuery = db.collection('trips').where('stars', '>=', 9);
        let nearQuery = db.collection('trips').where('address', '==', 'green');
        let recommendedQuery = db.collection('trips').where('address', '==', 'blue');
        let exploreQuery = db.collection('trips').where('address', '==', 'purple');
        let expensiveQuery = db.collection('trips').where('address', '==', 'grey');
        let cheapQuery = db.collection('trips').where('address', '==', 'orange');

        let tempPopTrips = [];
        let tempNearTrips = [];
        let tempRecommendedTrips = [];
        let tempExploreTrips = [];
        let tempExpensiveTrips = [];
        let tempCheapTrips = [];

        let popPromise = popQuery.get();
        let nearPromise = nearQuery.get();
        let recommendedPromise = recommendedQuery.get();
        let explorePromise = exploreQuery.get();
        let expensivePromise = expensiveQuery.get();
        let cheapPromise = cheapQuery.get();

        Promise.all([popPromise, nearPromise,recommendedPromise, explorePromise,expensivePromise,cheapPromise]).then((values) => {
            values[0].forEach((doc) => {
                // console.log(doc.data());
                tempPopTrips.push(doc);
            })
            values[1].forEach((doc) => {
                tempNearTrips.push(doc);
            })
            values[2].forEach((doc) => {
                tempRecommendedTrips.push(doc);
            })
            values[3].forEach((doc) => {
                tempExploreTrips.push(doc);
            })
            values[4].forEach((doc) => {
                tempExpensiveTrips.push(doc);
            })
            values[5].forEach((doc) => {
                tempCheapTrips.push(doc);
            })
            tempPopTrips = tempPopTrips.slice(0, tempPopTrips.length - tempPopTrips.length % 4);
            tempNearTrips = tempNearTrips.slice(0, tempNearTrips.length-tempNearTrips.length%2);
            tempRecommendedTrips = tempRecommendedTrips.slice(0, tempRecommendedTrips.length-tempRecommendedTrips.length%2);
            tempExploreTrips = tempExploreTrips.slice(0, tempExploreTrips.length-tempExploreTrips.length%2);
            tempExpensiveTrips = tempExpensiveTrips.slice(0, tempExpensiveTrips.length-tempExpensiveTrips.length%2);
            tempCheapTrips = tempCheapTrips.slice(0, tempCheapTrips.length-tempCheapTrips.length%2);

            this.setState({loaded: true, popularTrips: tempPopTrips, nearTrips: tempNearTrips, recommendedTrips:tempRecommendedTrips,
                exploreTrips: tempExploreTrips, expensiveTrips:tempExpensiveTrips,cheapTrips:tempCheapTrips});
        })
    }
    getTrips = (tripList) => {
        let container = <img src={heartSaved} style={{position:'relative',marginLeft:-32, marginTop:12,height: 22, width: 22, borderRadius:5}}/>
        let container1 = <img src={heart} style={{position:'relative',marginLeft:-32, marginTop:12,height: 22, width: 22, borderRadius:5}}/>
        tripList.sort(() => Math.random() - 0.5);
        return tripList.map((data) => (
            <div style={styles.card}
                 onClick={() => {
                     this.navigateToTrip(data.id)
                 }}
            >
                <div style={{display:'flex', flexDirection: 'row'}}>
                    <img src={data.data().image} style={{height: 160, width: '100%', borderRadius:5, }}/>
                    {parseInt(data.data().stars*10, 10)%2 === 1? container: container1}
                </div>
                <div style={{display:'flex', flexDirection: 'row', marginTop:7,marginLeft:5}}>
                    <img style={{marginTop:3,marginLeft:10,height:50, width:50, flex:1, }} src="https://t3.ftcdn.net/jpg/00/64/67/80/240_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"
                         className="account-picture"/>
                    <div style={{display:'flex', alignItems:'flex-start', flexDirection:'column', padding:3, marginLeft:15, flex:5}}>
                        <div style={styles.firstText}>{data.data().name}</div>
                        {/*<div style={styles.secondText}>{data.data().hashtag === undefined? "": data.data().hashtag.splice(0,data.data().hashtag.length%3).join(" ")}</div>*/}
                        <div style={styles.secondText}>{data.data().hashtag === undefined? "": data.data().hashtag.splice(0,2).join(" ")}</div>
                        <div style={{display:'flex', flexDirection:'row', marginTop:-5}}>
                            <StarRatings
                                rating={data.data().stars/2}
                                starRatedColor="#de574e"
                                numberOfStars={5}
                                name='rating'
                                starDimension='17px'
                                starSpacing= '1px'
                            />
                            <div style={{marginLeft:10,fontSize:13, color:'#404040',fontFamily:'Cochin'}}> {data.data().stars.toFixed(1) + "/10"}</div>
                        </div>
                        <div style={styles.thirdText}>{"By: " + first_names[Math.floor(first_names.length*Math.random())] + " " + last_names[Math.floor(last_names.length*Math.random())]}</div>
                    </div>
                </div>
            </div>
        ))
    }
    navigateToTrip = (trip) => {
        window.open("/mapview/" + trip, '_blank')
    };

    render() {
         first_names = first_names.filter(function(item){
            return item.length < 6;
            });
         last_names = last_names.filter(function(item){
            return item.length < 6;
            });

        let container = null;
        if (!this.state.loaded) {
            container = <div style={{marginTop:200}}>
                <Container><img src={require('../../imgs/loader.svg')} alt=''/></Container>
            </div>
        } else {
            {/*<div style={{marginTop:70, backgroundColor:'#e8e8e8', overflowY: 'scroll', height:620   }}>*/}
            {/*<div style={{flexDirection: 'row', marginTop: 70, width: '100%', backgroundColor:'#b8b8b8'}}>*/}
            container =
                <div style={{flexDirection: 'row', marginTop: 70, width: '100%', backgroundColor:'#e8e8e8'}}>
                    <div style={{display: 'flex', height: '100%', width: 50, position: 'fixed'}}>

                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginLeft: 50,
                        marginTop: 10,
                    }}>

                        <p style={styles.headerText1}>Most Popular</p>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={styles.tripsContainer}>
                                {this.getTrips(this.state.popularTrips)}
                            </div>
                        </div>


                        <div style={{backgroundColor:'#bdbdbd', borderWidth:10, width:'95%', border: 10, height:1, marginTop:40,marginLeft:15}}> </div>
                        {/*<div style={{backgroundColor:'#fff', borderWidth:10, width:'95%', border: 10, height:1, marginTop:40,marginLeft:15}}> </div>*/}


                        <p style={styles.headerText}> Near You </p>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={styles.tripsContainer}>
                                {this.getTrips(this.state.nearTrips)}
                            </div>
                        </div>
                        <div style={{backgroundColor:'#bdbdbd', borderWidth:10, width:'95%', border: 10, height:1, marginTop:40,marginLeft:15}}> </div>
                        {/*<div style={{backgroundColor:'#fff', borderWidth:10, width:'95%', border: 10, height:1, marginTop:40,marginLeft:15}}> </div>*/}


                        <p style={styles.headerText}> Recommended </p>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={styles.tripsContainer}>
                                {this.getTrips(this.state.recommendedTrips)}
                            </div>
                        </div>
                        <div style={{backgroundColor:'#bdbdbd', borderWidth:10, width:'95%', border: 10, height:1, marginTop:40,marginLeft:15}}> </div>
                        {/*<div style={{backgroundColor:'#fff', borderWidth:10, width:'95%', border: 10, height:1, marginTop:40,marginLeft:15}}> </div>*/}


                        <p style={styles.headerText}>Explore! </p>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={styles.tripsContainer}>
                                {this.getTrips(this.state.exploreTrips)}
                            </div>
                        </div>
                        <div style={{backgroundColor:'#bdbdbd', borderWidth:10, width:'95%', border: 10, height:1, marginTop:40,marginLeft:15}}> </div>
                        {/*<div style={{backgroundColor:'#fff', borderWidth:10, width:'95%', border: 10, height:1, marginTop:40,marginLeft:15}}> </div>*/}


                        <p style={styles.headerText}>$$$</p>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={styles.tripsContainer}>
                                {this.getTrips(this.state.expensiveTrips)}
                            </div>
                        </div>
                        <div style={{backgroundColor:'#bdbdbd', borderWidth:10, width:'95%', border: 10, height:1, marginTop:40,marginLeft:15}}> </div>
                        {/*<div style={{backgroundColor:'#fff', borderWidth:10, width:'95%', border: 10, height:1, marginTop:40,marginLeft:15}}> </div>*/}


                        <p style={styles.headerText}> $ </p>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={styles.tripsContainer}>
                                {this.getTrips(this.state.cheapTrips)}
                            </div>
                        </div>
                    </div>
                </div>
        }
        return (
            <div>
                {container}
            </div>
        );
    }
}

const styles = {
    tripsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        paddingTop: 20,
        marginRight:30,

        // paddingLeft:30,

    },
    card:{
        width: '23%',
        backgroundColor:'#b8b8b8',
        // backgroundColor:'#e8e8e8',
        marginBottom:15,
        borderRadius:5,
        marginTop:-5,
        // padding:1
    },
    firstText:{
        fontSize:18,
        marginBottom:7,
        fontFamily:'Cochin'
    },
    secondText:{
        fontSize:16,
        marginLeft:2,
        marginBottom:0,
        fontFamily:'Cochin',
        color:'#404040',
    },
    thirdText:{
        fontSize:16,
        paddingBottom:5,
        marginLeft:2,
        marginTop:-3,
        fontFamily:'Cochin',
        color:'#404040',
    },
    headerText:{textAlign: 'left', marginLeft: 20, paddingTop: 20, fontSize:23, marginBottom:-10,fontFamily:'Damascus', marginTop:-6, },
    headerText1:{textAlign: 'left', marginLeft: 20, paddingTop: 20, fontSize:23, marginBottom:-10,fontFamily:'Damascus', marginTop: 0,},
};
let first_names = ["Aaran", "Aaren", "Aarez", "Aarman", "Aaron", "Aarron", "Aaryan", "Adnan", "Adrian", "Adrien", "Aedan", "Aedin", "Aedyn", "Aeron", "Afonso", "Ahmad", "Ahmed", "Ahoua", "Aiadan", "Aidan", "Aiden",   "Aidian", "Aidy", "Ailin", "Aiman", "Ainsley", "Ainslie", "Airen", "Airidas", "Airlie", "AJ", "Ajay", "A-Jay", "Ajayraj", "Akan", "Akram", "Al", "Ala", "Alan", "Alanas",  "Alber", "Albert", "Albie", "Aldred", "Alec", "Aled", "Aleem", "Alessio", "Alex", "Alexander", "Alexei", "Alexx",  "Alf", "Alfee", "Alfie", "Alfred", "Alfy", "Alhaji", "Ali","Alistar", "Alister", "Aliyaan", "Allan",  "Ally",  "Alum", "Alvern", "Alvin", "Alyas", "Amaan", "Aman", "Amani", "Ambanimoh", "Ameer", "Amgad", "Ami", "Amin", "Amir", "Ammaar", "Ammar", "Ammer", "Amolpreet", "Amos", "Amrinder", "Amrit", "Amro", "Anay", "Andrea", "Andreas", "Andrei", "Andrejs", "Andrew", "Andy", "Anees", "Anesu", "Angel", "Angelo", "Angus", "Anir", "Anis", "Anish", "Anmolpreet", "Annan", "Anndra", "Anselm", "Anthony", "Anthony-John", "Antoine", "Anton", "Antoni", "Antonio", "Antony", "Antonyo", "Anubhav", "Aodhan", "Aon", "Aonghus", "Apisai", "Arafat", "Aran", "Arandeep", "Arann", "Aray", "Arayan", "Archibald", "Archie", "Arda", "Ardal", "Ardeshir", "Areeb", "Areez", "Aref", "Arfin", "Argyle", "Argyll", "Ari", "Aria", "Arian", "Arihant", "Aristomenis", "Aristotelis", "Arjuna", "Arlo", "Armaan", "Arman", "Armen", "Arnab", "Arnav", "Arnold", "Aron", "Aronas", "Arran", "Arrham", "Arron", "Arryn", "Arsalan", "Artem", "Arthur", "Artur", "Arturo", "Arun", "Arunas", "Arved", "Arya", "Aryan", "Aryankhan", "Aryian", "Aryn", "Asa", "Asfhan", "Ash", "Ashlee-jay", "Ashley", "Ashton", "Ashton-Lloyd", "Ashtyn", "Ashwin", "Asif", "Asim", "Aslam", "Asrar", "Ata", "Atal", "Atapattu", "Ateeq", "Athol", "Athon", "Athos-Carlos", "Atli", "Atom", "Attila", "Aulay", "Aun", "Austen", "Austin", "Avani", "Averon", "Avi", "Avinash", "Avraham", "Awais", "Awwal", "Axel", "Ayaan", "Ayan", "Aydan", "Ayden", "Aydin", "Aydon", "Ayman", "Ayomide", "Ayren", "Ayrton", "Aytug", "Ayub", "Ayyub", "Azaan", "Azedine", "Azeem", "Azim", "Aziz", "Azlan", "Azzam", "Azzedine", "Babatunmise", "Babur", "Bader", "Badr", "Badsha", "Bailee", "Bailey", "Bailie", "Bailley", "Baillie", "Baley", "Balian", "Banan", "Barath", "Barkley", "Barney", "Baron", "Barrie", "Barry", "Bartlomiej", "Bartosz", "Basher", "Basile", "Baxter", "Baye", "Bayley", "Beau", "Beinn", "Bekim", "Believe", "Ben", "Bendeguz", "Benedict", "Benjamin", "Benjamyn", "Benji", "Benn", "Bennett", "Benny", "Benoit", "Bentley", "Berkay", "Bernard", "Bertie", "Bevin", "Bezalel", "Bhaaldeen", "Bharath", "Bilal", "Bill", "Billy", "Binod", "Bjorn", "Blaike", "Blaine", "Blair", "Blaire", "Blake", "Blazej", "Blazey", "Blessing", "Blue", "Blyth", "Bo", "Boab", "Bob", "Bobby", "Bobby-Lee", "Bodhan", "Boedyn", "Bogdan", "Bohbi", "Bony", "Bowen", "Bowie", "Boyd", "Bracken", "Brad", "Bradan", "Braden", "Bradley", "Bradlie", "Bradly", "Brady", "Bradyn", "Braeden", "Braiden", "Brajan", "Brandan", "Branden", "Brandon", "Brandonlee", "Brandon-Lee", "Brandyn", "Brannan", "Brayden", "Braydon", "Braydyn", "Breandan", "Brehme", "Brendan", "Brendon", "Brendyn", "Breogan", "Bret", "Brett", "Briaddon", "Brian", "Brodi", "Brodie", "Brody", "Brogan", "Broghan", "Brooke", "Brooklin", "Brooklyn", "Bruce", "Bruin", "Bruno", "Brunon", "Bryan", "Bryce", "Bryden", "Brydon", "Brydon-Craig", "Bryn", "Brynmor", "Bryson", "Buddy", "Bully", "Burak", "Burhan", "Butali", "Butchi", "Byron", "Cabhan", "Cadan", "Cade", "Caden", "Cadon", "Cadyn", "Caedan", "Caedyn", "Cael", "Caelan", "Caelen", "Caethan", "Cahl", "Cahlum", "Cai", "Caidan", "Caiden", "Caiden-Paul", "Caidyn", "Caie", "Cailaen", "Cailean", "Caileb-John", "Cailin", "Cain", "Caine", "Cairn", "Cal", "Calan", "Calder", "Cale", "Calean", "Caleb", "Calen", "Caley", "Calib", "Calin", "Callahan", "Callan", "Callan-Adam", "Calley", "Callie", "Callin", "Callum", "Callun", "Callyn", "Calum", "Calum-James", "Calvin", "Cambell", "Camerin", "Cameron", "Campbel", "Campbell", "Camron", "Caolain", "Caolan", "Carl", "Carlo", "Carlos", "Carrich", "Carrick", "Carson", "Carter", "Carwyn", "Casey", "Casper", "Cassy", "Cathal", "Cator", "Cavan", "Cayden", "Cayden-Robert", "Cayden-Tiamo", "Ceejay", "Ceilan", "Ceiran", "Ceirin", "Ceiron", "Cejay", "Celik", "Cephas", "Cesar", "Cesare", "Chad", "Chaitanya", "Chang-Ha", "Charles", "Charley", "Charlie", "Charly", "Chase", "Che", "Chester", "Chevy", "Chi", "Chibudom", "Chidera", "Chimsom", "Chin", "Chintu", "Chiqal", "Chiron", "Chris", "Chris-Daniel", "Chrismedi", "Christian", "Christie", "Christoph", "Christopher", "Christopher-Lee", "Christy", "Chu", "Chukwuemeka", "Cian", "Ciann", "Ciar", "Ciaran", "Ciarian", "Cieran", "Cillian", "Cillin", "Cinar", "CJ", "C-Jay", "Clark", "Clarke", "Clayton", "Clement", "Clifford", "Clyde", "Cobain", "Coban", "Coben", "Cobi", "Cobie", "Coby", "Codey", "Codi", "Codie", "Cody", "Cody-Lee", "Coel", "Cohan", "Cohen", "Colby", "Cole", "Colin", "Coll", "Colm", "Colt", "Colton", "Colum", "Colvin", "Comghan", "Conal", "Conall", "Conan", "Conar", "Conghaile", "Conlan", "Conley", "Conli", "Conlin", "Conlly", "Conlon", "Conlyn", "Connal", "Connall", "Connan", "Connar", "Connel", "Connell", "Conner", "Connolly", "Connor", "Connor-David", "Conor", "Conrad", "Cooper", "Copeland", "Coray", "Corben", "Corbin", "Corey", "Corey-James", "Corey-Jay", "Cori", "Corie", "Corin", "Cormac", "Cormack", "Cormak", "Corran", "Corrie", "Cory", "Cosmo", "Coupar", "Craig", "Craig-James", "Crawford", "Creag", "Crispin", "Cristian", "Crombie", "Cruiz", "Cruz", "Cuillin", "Cullen", "Cullin", "Curtis", "Cyrus", "Daanyaal", "Daegan", "Daegyu", "Dafydd", "Dagon", "Dailey", "Daimhin", "Daithi", "Dakota", "Daksh", "Dale", "Dalong", "Dalton", "Damian", "Damien", "Damon", "Dan", "Danar", "Dane", "Danial", "Daniel", "Daniele", "Daniel-James", "Daniels", "Daniil", "Danish", "Daniyal", "Danniel", "Danny", "Dante", "Danyal", "Danyil", "Danys", "Daood", "Dara", "Darach", "Daragh", "Darcy", "D'arcy", "Dareh", "Daren", "Darien", "Darius", "Darl", "Darn", "Darrach", "Darragh", "Darrel", "Darrell", "Darren", "Darrie", "Darrius", "Darroch", "Darryl", "Darryn", "Darwyn", "Daryl", "Daryn", "Daud", "Daumantas", "Davi", "David", "David-Jay", "David-Lee", "Davie", "Davis", "Davy", "Dawid", "Dawson", "Dawud", "Dayem", "Daymian", "Deacon", "Deagan", "Dean", "Deano", "Decklan", "Declain", "Declan", "Declyan", "Declyn", "Dedeniseoluwa", "Deecan", "Deegan", "Deelan", "Deklain-Jaimes", "Del", "Demetrius", "Denis", "Deniss", "Dennan", "Dennin", "Dennis", "Denny", "Dennys", "Denon", "Denton", "Denver", "Denzel", "Deon", "Derek", "Derick", "Derin", "Dermot", "Derren", "Derrie", "Derrin", "Derron", "Derry", "Derryn", "Deryn", "Deshawn", "Desmond", "Dev", "Devan", "Devin", "Devlin", "Devlyn", "Devon", "Devrin", "Devyn", "Dex", "Dexter", "Dhani", "Dharam", "Dhavid", "Dhyia", "Diarmaid", "Diarmid", "Diarmuid", "Didier", "Diego", "Diesel", "Diesil", "Digby", "Dilan", "Dilano", "Dillan", "Dillon", "Dilraj", "Dimitri", "Dinaras", "Dion", "Dissanayake", "Dmitri", "Doire", "Dolan", "Domanic", "Domenico", "Domhnall", "Dominic", "Dominick", "Dominik", "Donald", "Donnacha", "Donnie", "Dorian", "Dougal", "Douglas", "Dougray", "Drakeo", "Dre", "Dregan", "Drew", "Dugald", "Duncan", "Duriel", "Dustin", "Dylan", "Dylan-Jack", "Dylan-James", "Dylan-John", "Dylan-Patrick", "Dylin", "Dyllan", "Dyllan-James", "Dyllon", "Eadie", "Eagann", "Eamon", "Eamonn", "Eason", "Eassan", "Easton", "Ebow", "Ed", "Eddie", "Eden", "Ediomi", "Edison", "Eduardo", "Eduards", "Edward", "Edwin", "Edwyn", "Eesa", "Efan", "Efe", "Ege", "Ehsan", "Ehsen", "Eiddon", "Eidhan", "Eihli", "Eimantas", "Eisa", "Eli", "Elias", "Elijah", "Eliot", "Elisau", "Eljay", "Eljon", "Elliot", "Elliott", "Ellis", "Ellisandro", "Elshan", "Elvin", "Elyan", "Emanuel", "Emerson", "Emil", "Emile", "Emir", "Emlyn", "Emmanuel", "Emmet", "Eng", "Eniola", "Enis", "Ennis", "Enrico", "Enrique", "Enzo", "Eoghain", "Eoghan", "Eoin", "Eonan", "Erdehan", "Eren", "Erencem", "Eric", "Ericlee", "Erik", "Eriz", "Ernie-Jacks", "Eroni", "Eryk", "Eshan", "Essa", "Esteban", "Ethan", "Etienne", "Etinosa", "Euan", "Eugene", "Evan", "Evann", "Ewan", "Ewen", "Ewing", "Exodi", "Ezekiel", "Ezra", "Fabian", "Fahad", "Faheem", "Faisal", "Faizaan", "Famara", "Fares", "Farhaan", "Farhan", "Farren", "Farzad", "Fauzaan", "Favour", "Fawaz", "Fawkes", "Faysal", "Fearghus", "Feden", "Felix", "Fergal", "Fergie", "Fergus", "Ferre", "Fezaan", "Fiachra", "Fikret", "Filip", "Filippo", "Finan", "Findlay", "Findlay-James", "Findlie", "Finlay", "Finley", "Finn", "Finnan", "Finnean", "Finnen", "Finnlay", "Finnley", "Fintan", "Fionn", "Firaaz", "Fletcher", "Flint", "Florin", "Flyn", "Flynn", "Fodeba", "Folarinwa", "Forbes", "Forgan", "Forrest", "Fox", "Francesco", "Francis", "Francisco", "Franciszek", "Franco", "Frank", "Frankie", "Franklin", "Franko", "Fraser", "Frazer", "Fred", "Freddie", "Frederick", "Fruin", "Fyfe", "Fyn", "Fynlay", "Fynn", "Gabriel", "Gallagher", "Gareth", "Garren", "Garrett", "Garry", "Gary", "Gavin", "Gavin-Lee", "Gene", "Geoff", "Geoffrey", "Geomer", "Geordan", "Geordie", "George", "Georgia", "Georgy", "Gerard", "Ghyll", "Giacomo", "Gian", "Giancarlo", "Gianluca", "Gianmarco", "Gideon", "Gil", "Gio", "Girijan", "Girius", "Gjan", "Glascott", "Glen", "Glenn", "Gordon", "Grady", "Graeme", "Graham", "Grahame", "Grant", "Grayson", "Greg", "Gregor", "Gregory", "Greig", "Griffin", "Griffyn", "Grzegorz", "Guang", "Guerin", "Guillaume", "Gurardass", "Gurdeep", "Gursees", "Gurthar", "Gurveer", "Gurwinder", "Gus", "Gustav", "Guthrie", "Guy", "Gytis", "Habeeb", "Hadji", "Hadyn", "Hagun", "Haiden", "Haider", "Hamad", "Hamid", "Hamish", "Hamza", "Hamzah", "Han", "Hansen", "Hao", "Hareem", "Hari", "Harikrishna", "Haris", "Harish", "Harjeevan", "Harjyot", "Harlee", "Harleigh", "Harley", "Harman", "Harnek", "Harold", "Haroon", "Harper", "Harri", "Harrington", "Harris", "Harrison", "Harry", "Harvey", "Harvie", "Harvinder", "Hasan", "Haseeb", "Hashem", "Hashim", "Hassan", "Hassanali", "Hately", "Havila", "Hayden", "Haydn", "Haydon", "Haydyn", "Hcen", "Hector", "Heddle", "Heidar", "Heini", "Hendri", "Henri", "Henry", "Herbert", "Heyden", "Hiro", "Hirvaansh", "Hishaam", "Hogan", "Honey", "Hong", "Hope", "Hopkin", "Hosea", "Howard", "Howie", "Hristomir", "Hubert", "Hugh", "Hugo", "Humza", "Hunter", "Husnain", "Hussain", "Hussan", "Hussnain", "Hussnan", "Hyden", "I", "Iagan", "Iain", "Ian", "Ibraheem", "Ibrahim", "Idahosa", "Idrees", "Idris", "Iestyn", "Ieuan", "Igor", "Ihtisham", "Ijay", "Ikechukwu", "Ikemsinachukwu", "Ilyaas", "Ilyas", "Iman", "Immanuel", "Inan", "Indy", "Ines", "Innes", "Ioannis", "Ireayomide", "Ireoluwa", "Irvin", "Irvine", "Isa", "Isaa", "Isaac", "Isaiah", "Isak", "Isher", "Ishwar", "Isimeli", "Isira", "Ismaeel", "Ismail", "Israel", "Issiaka", "Ivan", "Ivar", "Izaak", "J", "Jaay", "Jac", "Jace", "Jack", "Jacki", "Jackie", "Jack-James", "Jackson", "Jacky", "Jacob", "Jacques", "Jad", "Jaden", "Jadon", "Jadyn", "Jae", "Jagat", "Jago", "Jaheim", "Jahid", "Jahy", "Jai", "Jaida", "Jaiden", "Jaidyn", "Jaii", "Jaime", "Jai-Rajaram", "Jaise", "Jak", "Jake", "Jakey", "Jakob", "Jaksyn", "Jakub", "Jamaal", "Jamal", "Jameel", "Jameil", "James", "James-Paul", "Jamey", "Jamie", "Jan", "Jaosha", "Jardine", "Jared", "Jarell", "Jarl", "Jarno", "Jarred", "Jarvi", "Jasey-Jay", "Jasim", "Jaskaran", "Jason", "Jasper", "Jaxon", "Jaxson", "Jay", "Jaydan", "Jayden", "Jayden-James", "Jayden-Lee", "Jayden-Paul", "Jayden-Thomas", "Jaydn", "Jaydon", "Jaydyn", "Jayhan", "Jay-Jay", "Jayke", "Jaymie", "Jayse", "Jayson", "Jaz", "Jazeb", "Jazib", "Jazz", "Jean", "Jean-Lewis", "Jean-Pierre", "Jebadiah", "Jed", "Jedd", "Jedidiah", "Jeemie", "Jeevan", "Jeffrey", "Jensen", "Jenson", "Jensyn", "Jeremy", "Jerome", "Jeronimo", "Jerrick", "Jerry", "Jesse", "Jesuseun", "Jeswin", "Jevan", "Jeyun", "Jez", "Jia", "Jian", "Jiao", "Jimmy", "Jincheng", "JJ", "Joaquin", "Joash", "Jock", "Jody", "Joe", "Joeddy", "Joel", "Joey", "Joey-Jack", "Johann", "Johannes", "Johansson", "John", "Johnathan", "Johndean", "Johnjay", "John-Michael", "Johnnie", "Johnny", "Johnpaul", "John-Paul", "John-Scott", "Johnson", "Jole", "Jomuel", "Jon", "Jonah", "Jonatan", "Jonathan", "Jonathon", "Jonny", "Jonothan", "Jon-Paul", "Jonson", "Joojo", "Jordan", "Jordi", "Jordon", "Jordy", "Jordyn", "Jorge", "Joris", "Jorryn", "Josan", "Josef", "Joseph", "Josese", "Josh", "Joshiah", "Joshua", "Josiah", "Joss", "Jostelle", "Joynul", "Juan", "Jubin", "Judah", "Jude", "Jules", "Julian", "Julien", "Jun", "Junior", "Jura", "Justan", "Justin", "Justinas", "Kaan", "Kabeer", "Kabir", "Kacey", "Kacper", "Kade", "Kaden", "Kadin", "Kadyn", "Kaeden", "Kael", "Kaelan", "Kaelin", "Kaelum", "Kai", "Kaid", "Kaidan", "Kaiden", "Kaidinn", "Kaidyn", "Kaileb", "Kailin", "Kain", "Kaine", "Kainin", "Kainui", "Kairn", "Kaison", "Kaiwen", "Kajally", "Kajetan", "Kalani", "Kale", "Kaleb", "Kaleem", "Kal-el", "Kalen", "Kalin", "Kallan", "Kallin", "Kalum", "Kalvin", "Kalvyn", "Kameron", "Kames", "Kamil", "Kamran", "Kamron", "Kane", "Karam", "Karamvir", "Karandeep", "Kareem", "Karim", "Karimas", "Karl", "Karol", "Karson", "Karsyn", "Karthikeya", "Kasey", "Kash", "Kashif", "Kasim", "Kasper", "Kasra", "Kavin", "Kayam", "Kaydan", "Kayden", "Kaydin", "Kaydn", "Kaydyn", "Kaydyne", "Kayleb", "Kaylem", "Kaylum", "Kayne", "Kaywan", "Kealan", "Kealon", "Kean", "Keane", "Kearney", "Keatin", "Keaton", "Keavan", "Keayn", "Kedrick", "Keegan", "Keelan", "Keelin", "Keeman", "Keenan", "Keenan-Lee", "Keeton", "Kehinde", "Keigan", "Keilan", "Keir", "Keiran", "Keiren", "Keiron", "Keiryn", "Keison", "Keith", "Keivlin", "Kelam", "Kelan", "Kellan", "Kellen", "Kelso", "Kelum", "Kelvan", "Kelvin", "Ken", "Kenan", "Kendall", "Kendyn", "Kenlin", "Kenneth", "Kensey", "Kenton", "Kenyon", "Kenzeigh", "Kenzi", "Kenzie", "Kenzo", "Kenzy", "Keo", "Ker", "Kern", "Kerr", "Kevan", "Kevin", "Kevyn", "Kez", "Khai", "Khalan", "Khaleel", "Khaya", "Khevien", "Khizar", "Khizer", "Kia", "Kian", "Kian-James", "Kiaran", "Kiarash", "Kie", "Kiefer", "Kiegan", "Kienan", "Kier", "Kieran", "Kieran-Scott", "Kieren", "Kierin", "Kiern", "Kieron", "Kieryn", "Kile", "Killian", "Kimi", "Kingston", "Kinneil", "Kinnon", "Kinsey", "Kiran", "Kirk", "Kirwin", "Kit", "Kiya", "Kiyonari", "Kjae", "Klein", "Klevis", "Kobe", "Kobi", "Koby", "Koddi", "Koden", "Kodi", "Kodie", "Kody", "Kofi", "Kogan", "Kohen", "Kole", "Konan", "Konar", "Konnor", "Konrad", "Koray", "Korben", "Korbyn", "Korey", "Kori", "Korrin", "Kory", "Koushik", "Kris", "Krish", "Krishan", "Kriss", "Kristian", "Kristin", "Kristofer", "Kristoffer", "Kristopher", "Kruz", "Krzysiek", "Krzysztof", "Ksawery", "Ksawier", "Kuba", "Kurt", "Kurtis", "Kurtis-Jae", "Kyaan", "Kyan", "Kyde", "Kyden", "Kye", "Kyel", "Kyhran", "Kyie", "Kylan", "Kylar", "Kyle", "Kyle-Derek", "Kylian", "Kym", "Kynan", "Kyral", "Kyran", "Kyren", "Kyrillos", "Kyro", "Kyron", "Kyrran", "Lachlainn", "Lachlan", "Lachlann", "Lael", "Lagan", "Laird", "Laison", "Lakshya", "Lance", "Lancelot", "Landon", "Lang", "Lasse", "Latif", "Lauchlan", "Lauchlin", "Laughlan", "Lauren", "Laurence", "Laurie", "Lawlyn", "Lawrence", "Lawrie", "Lawson", "Layne", "Layton", "Lee", "Leigh", "Leigham", "Leighton", "Leilan", "Leiten", "Leithen", "Leland", "Lenin", "Lennan", "Lennen", "Lennex", "Lennon", "Lennox", "Lenny", "Leno", "Lenon", "Lenyn", "Leo", "Leon", "Leonard", "Leonardas", "Leonardo", "Lepeng", "Leroy", "Leven", "Levi", "Levon", "Levy", "Lewie", "Lewin", "Lewis", "Lex", "Leydon", "Leyland", "Leylann", "Leyton", "Liall", "Liam", "Liam-Stephen", "Limo", "Lincoln", "Lincoln-John", "Lincon", "Linden", "Linton", "Lionel", "Lisandro", "Litrell", "Liyonela-Elam", "LLeyton", "Lliam", "Lloyd", "Lloyde", "Loche", "Lochlan", "Lochlann", "Lochlan-Oliver", "Lock", "Lockey", "Logan", "Logann", "Logan-Rhys", "Loghan", "Lokesh", "Loki", "Lomond", "Lorcan", "Lorenz", "Lorenzo", "Lorne", "Loudon", "Loui", "Louie", "Louis", "Loukas", "Lovell", "Luc", "Luca", "Lucais", "Lucas", "Lucca", "Lucian", "Luciano", "Lucien", "Lucus", "Luic", "Luis", "Luk", "Luka", "Lukas", "Lukasz", "Luke", "Lukmaan", "Luqman", "Lyall", "Lyle", "Lyndsay", "Lysander", "Maanav", "Maaz", "Mac", "Macallum", "Macaulay", "Macauley", "Macaully", "Machlan", "Maciej", "Mack", "Mackenzie", "Mackenzy", "Mackie", "Macsen", "Macy", "Madaki", "Maddison", "Maddox", "Madison", "Madison-Jake", "Madox", "Mael", "Magnus", "Mahan", "Mahdi", "Mahmoud", "Maias", "Maison", "Maisum", "Maitlind", "Majid", "Makensie", "Makenzie", "Makin", "Maksim", "Maksymilian", "Malachai", "Malachi", "Malachy", "Malakai", "Malakhy", "Malcolm", "Malik", "Malikye", "Malo", "Ma'moon", "Manas", "Maneet", "Manmohan", "Manolo", "Manson", "Mantej", "Manuel", "Manus", "Marc", "Marc-Anthony", "Marcel", "Marcello", "Marcin", "Marco", "Marcos", "Marcous", "Marcquis", "Marcus", "Mario", "Marios", "Marius", "Mark", "Marko", "Markus", "Marley", "Marlin", "Marlon", "Maros", "Marshall", "Martin", "Marty", "Martyn", "Marvellous", "Marvin", "Marwan", "Maryk", "Marzuq", "Mashhood", "Mason", "Mason-Jay", "Masood", "Masson", "Matas", "Matej", "Mateusz", "Mathew", "Mathias", "Mathu", "Mathuyan", "Mati", "Matt", "Matteo", "Matthew", "Matthew-William", "Matthias", "Max", "Maxim", "Maximilian", "Maximillian", "Maximus", "Maxwell", "Maxx", "Mayeul", "Mayson", "Mazin", "Mcbride", "McCaulley", "McKade", "McKauley", "McKay", "McKenzie", "McLay", "Meftah", "Mehmet", "Mehraz", "Meko", "Melville", "Meshach", "Meyzhward", "Micah", "Michael", "Michael-Alexander", "Michael-James", "Michal", "Michat", "Micheal", "Michee", "Mickey", "Miguel", "Mika", "Mikael", "Mikee", "Mikey", "Mikhail", "Mikolaj", "Miles", "Millar", "Miller", "Milo", "Milos", "Milosz", "Mir", "Mirza", "Mitch", "Mitchel", "Mitchell", "Moad", "Moayd", "Mobeen", "Modoulamin", "Modu", "Mohamad", "Mohamed", "Mohammad", "Mohammad-Bilal", "Mohammed", "Mohanad", "Mohd", "Momin", "Momooreoluwa", "Montague", "Montgomery", "Monty", "Moore", "Moosa", "Moray", "Morgan", "Morgyn", "Morris", "Morton", "Moshy", "Motade", "Moyes", "Msughter", "Mueez", "Muhamadjavad", "Muhammad", "Muhammed", "Muhsin", "Muir", "Munachi", "Muneeb", "Mungo", "Munir", "Munmair", "Munro", "Murdo", "Murray", "Murrough", "Murry", "Musa", "Musse", "Mustafa", "Mustapha", "Muzammil", "Muzzammil", "Mykie", "Myles", "Mylo", "Nabeel", "Nadeem", "Nader", "Nagib", "Naif", "Nairn", "Narvic", "Nash", "Nasser", "Nassir", "Natan", "Nate", "Nathan", "Nathanael", "Nathanial", "Nathaniel", "Nathan-Rae", "Nawfal", "Nayan", "Neco", "Neil", "Nelson", "Neo", "Neshawn", "Nevan", "Nevin", "Ngonidzashe", "Nial", "Niall", "Nicholas", "Nick", "Nickhill", "Nicki", "Nickson", "Nicky", "Nico", "Nicodemus", "Nicol", "Nicolae", "Nicolas", "Nidhish", "Nihaal", "Nihal", "Nikash", "Nikhil", "Niki", "Nikita", "Nikodem", "Nikolai", "Nikos", "Nilav", "Niraj", "Niro", "Niven", "Noah", "Noel", "Nolan", "Noor", "Norman", "Norrie", "Nuada", "Nyah", "Oakley", "Oban", "Obieluem", "Obosa", "Odhran", "Odin", "Odynn", "Ogheneochuko", "Ogheneruno", "Ohran", "Oilibhear", "Oisin", "Ojima-Ojo", "Okeoghene", "Olaf", "Ola-Oluwa", "Olaoluwapolorimi", "Ole", "Olie", "Oliver", "Olivier", "Oliwier", "Ollie", "Olurotimi", "Oluwadamilare", "Oluwadamiloju", "Oluwafemi", "Oluwafikunayomi", "Oluwalayomi", "Oluwatobiloba", "Oluwatoni", "Omar", "Omri", "Oran", "Orin", "Orlando", "Orley", "Orran", "Orrick", "Orrin", "Orson", "Oryn", "Oscar", "Osesenagha", "Oskar", "Ossian", "Oswald", "Otto", "Owain", "Owais", "Owen", "Owyn", "Oz", "Ozzy", "Pablo", "Pacey", "Padraig", "Paolo", "Pardeepraj", "Parkash", "Parker", "Pascoe", "Pasquale", "Patrick", "Patrick-John", "Patrikas", "Patryk", "Paul", "Pavit", "Pawel", "Pawlo", "Pearce", "Pearse", "Pearsen", "Pedram", "Pedro", "Peirce", "Peiyan", "Pele", "Peni", "Peregrine", "Peter", "Phani", "Philip", "Philippos", "Phinehas", "Phoenix", "Phoevos", "Pierce", "Pierre-Antoine", "Pieter", "Pietro", "Piotr", "Porter", "Prabhjoit", "Prabodhan", "Praise", "Pranav", "Pravin", "Precious", "Prentice", "Presley", "Preston", "Preston-Jay", "Prinay", "Prince", "Prithvi", "Promise", "Puneetpaul", "Pushkar", "Qasim", "Qirui", "Quinlan", "Quinn", "Radmiras", "Raees", "Raegan", "Rafael", "Rafal", "Rafferty", "Rafi", "Raheem", "Rahil", "Rahim", "Rahman", "Raith", "Raithin", "Raja", "Rajab-Ali", "Rajan", "Ralfs", "Ralph", "Ramanas", "Ramit", "Ramone", "Ramsay", "Ramsey", "Rana", "Ranolph", "Raphael", "Rasmus", "Rasul", "Raul", "Raunaq", "Ravin", "Ray", "Rayaan", "Rayan", "Rayane", "Rayden", "Rayhan", "Raymond", "Rayne", "Rayyan", "Raza", "Reace", "Reagan", "Reean", "Reece", "Reed", "Reegan", "Rees", "Reese", "Reeve", "Regan", "Regean", "Reggie", "Rehaan", "Rehan", "Reice", "Reid", "Reigan", "Reilly", "Reily", "Reis", "Reiss", "Remigiusz", "Remo", "Remy", "Ren", "Renars", "Reng", "Rennie", "Reno", "Reo", "Reuben", "Rexford", "Reynold", "Rhein", "Rheo", "Rhett", "Rheyden", "Rhian", "Rhoan", "Rholmark", "Rhoridh", "Rhuairidh", "Rhuan", "Rhuaridh", "Rhudi", "Rhy", "Rhyan", "Rhyley", "Rhyon", "Rhys", "Rhys-Bernard", "Rhyse", "Riach", "Rian", "Ricards", "Riccardo", "Ricco", "Rice", "Richard", "Richey", "Richie", "Ricky", "Rico", "Ridley", "Ridwan", "Rihab", "Rihan", "Rihards", "Rihonn", "Rikki", "Riley", "Rio", "Rioden", "Rishi", "Ritchie", "Rivan", "Riyadh", "Riyaj", "Roan", "Roark", "Roary", "Rob", "Robbi", "Robbie", "Robbie-lee", "Robby", "Robert", "Robert-Gordon", "Robertjohn", "Robi", "Robin", "Rocco", "Roddy", "Roderick", "Rodrigo", "Roen", "Rogan", "Roger", "Rohaan", "Rohan", "Rohin", "Rohit", "Rokas", "Roman", "Ronald", "Ronan", "Ronan-Benedict", "Ronin", "Ronnie", "Rooke", "Roray", "Rori", "Rorie", "Rory", "Roshan", "Ross", "Ross-Andrew", "Rossi", "Rowan", "Rowen", "Roy", "Ruadhan", "Ruaidhri", "Ruairi", "Ruairidh", "Ruan", "Ruaraidh", "Ruari", "Ruaridh", "Ruben", "Rubhan", "Rubin", "Rubyn", "Rudi", "Rudy", "Rufus", "Rui", "Ruo", "Rupert", "Ruslan", "Russel", "Russell", "Ryaan", "Ryan", "Ryan-Lee", "Ryden", "Ryder", "Ryese", "Ryhs", "Rylan", "Rylay", "Rylee", "Ryleigh", "Ryley", "Rylie", "Ryo", "Ryszard", "Saad", "Sabeen", "Sachkirat", "Saffi", "Saghun", "Sahaib", "Sahbian", "Sahil", "Saif", "Saifaddine", "Saim", "Sajid", "Sajjad", "Salahudin", "Salman", "Salter", "Salvador", "Sam", "Saman", "Samar", "Samarjit", "Samatar", "Sambrid", "Sameer", "Sami", "Samir", "Sami-Ullah", "Samual", "Samuel", "Samuela", "Samy", "Sanaullah", "Sandro", "Sandy", "Sanfur", "Sanjay", "Santiago", "Santino", "Satveer", "Saul", "Saunders", "Savin", "Sayad", "Sayeed", "Sayf", "Scot", "Scott", "Scott-Alexander", "Seaan", "Seamas", "Seamus", "Sean", "Seane", "Sean-James", "Sean-Paul", "Sean-Ray", "Seb", "Sebastian", "Sebastien", "Selasi", "Seonaidh", "Sephiroth", "Sergei", "Sergio", "Seth", "Sethu", "Seumas", "Shaarvin", "Shadow", "Shae", "Shahmir", "Shai", "Shane", "Shannon", "Sharland", "Sharoz", "Shaughn", "Shaun", "Shaunpaul", "Shaun-Paul", "Shaun-Thomas", "Shaurya", "Shaw", "Shawn", "Shawnpaul", "Shay", "Shayaan", "Shayan", "Shaye", "Shayne", "Shazil", "Shea", "Sheafan", "Sheigh", "Shenuk", "Sher", "Shergo", "Sheriff", "Sherwyn", "Shiloh", "Shiraz", "Shreeram", "Shreyas", "Shyam", "Siddhant", "Siddharth", "Sidharth", "Sidney", "Siergiej", "Silas", "Simon", "Sinai", "Skye", "Sofian", "Sohaib", "Sohail", "Soham", "Sohan", "Sol", "Solomon", "Sonneey", "Sonni", "Sonny", "Sorley", "Soul", "Spencer", "Spondon", "Stanislaw", "Stanley", "Stefan", "Stefano", "Stefin", "Stephen", "Stephenjunior", "Steve", "Steven", "Steven-lee", "Stevie", "Stewart", "Stewarty", "Strachan", "Struan", "Stuart", "Su", "Subhaan", "Sudais", "Suheyb", "Suilven", "Sukhi", "Sukhpal", "Sukhvir", "Sulayman", "Sullivan", "Sultan", "Sung", "Sunny", "Suraj", "Surien", "Sweyn", "Syed", "Sylvain", "Symon", "Szymon", "Tadd", "Taddy", "Tadhg", "Taegan", "Taegen", "Tai", "Tait", "Taiwo", "Talha", "Taliesin", "Talon", "Talorcan", "Tamar", "Tamiem", "Tammam", "Tanay", "Tane", "Tanner", "Tanvir", "Tanzeel", "Taonga", "Tarik", "Tariq-Jay", "Tate", "Taylan", "Taylar", "Tayler", "Taylor", "Taylor-Jay", "Taylor-Lee", "Tayo", "Tayyab", "Tayye", "Tayyib", "Teagan", "Tee", "Teejay", "Tee-jay", "Tegan", "Teighen", "Teiyib", "Te-Jay", "Temba", "Teo", "Teodor", "Teos", "Terry", "Teydren", "Theo", "Theodore", "Thiago", "Thierry", "Thom", "Thomas", "Thomas-Jay", "Thomson", "Thorben", "Thorfinn", "Thrinei", "Thumbiko", "Tiago", "Tian", "Tiarnan", "Tibet", "Tieran", "Tiernan", "Timothy", "Timucin", "Tiree", "Tisloh", "Titi", "Titus", "Tiylar", "TJ", "Tjay", "T-Jay", "Tobey", "Tobi", "Tobias", "Tobie", "Toby", "Todd", "Tokinaga", "Toluwalase", "Tom", "Tomas", "Tomasz", "Tommi-Lee", "Tommy", "Tomson", "Tony", "Torin", "Torquil", "Torran", "Torrin", "Torsten", "Trafford", "Trai", "Travis", "Tre", "Trent", "Trey", "Tristain", "Tristan", "Troy", "Tubagus", "Turki", "Turner", "Ty", "Ty-Alexander", "Tye", "Tyelor", "Tylar", "Tyler", "Tyler-James", "Tyler-Jay", "Tyllor", "Tylor", "Tymom", "Tymon", "Tymoteusz", "Tyra", "Tyree", "Tyrnan", "Tyrone", "Tyson", "Ubaid", "Ubayd", "Uchenna", "Uilleam", "Umair", "Umar", "Umer", "Umut", "Urban", "Uri", "Usman", "Uzair", "Uzayr", "Valen", "Valentin", "Valentino", "Valery", "Valo", "Vasyl", "Vedantsinh", "Veeran", "Victor", "Victory", "Vinay", "Vince", "Vincent", "Vincenzo", "Vinh", "Vinnie", "Vithujan", "Vladimir", "Vladislav", "Vrishin", "Vuyolwethu", "Wabuya", "Wai", "Walid", "Wallace", "Walter", "Waqaas", "Warkhas", "Warren", "Warrick", "Wasif", "Wayde", "Wayne", "Wei", "Wen", "Wesley", "Wesley-Scott", "Wiktor", "Wilkie", "Will", "William", "William-John", "Willum", "Wilson", "Windsor", "Wojciech", "Woyenbrakemi", "Wyatt", "Wylie", "Wynn", "Xabier", "Xander", "Xavier", "Xiao", "Xida", "Xin", "Xue", "Yadgor", "Yago", "Yahya", "Yakup", "Yang", "Yanick", "Yann", "Yannick", "Yaseen", "Yasin", "Yasir", "Yassin", "Yoji", "Yong", "Yoolgeun", "Yorgos", "Youcef", "Yousif", "Youssef", "Yu", "Yuanyu", "Yuri", "Yusef", "Yusuf", "Yves", "Zaaine", "Zaak", "Zac", "Zach", "Zachariah", "Zacharias", "Zacharie", "Zacharius", "Zachariya", "Zachary", "Zachary-Marc", "Zachery", "Zack", "Zackary", "Zaid", "Zain", "Zaine", "Zaineddine", "Zainedin", "Zak", "Zakaria", "Zakariya", "Zakary", "Zaki", "Zakir", "Zakk", "Zamaar", "Zander", "Zane", "Zarran", "Zayd", "Zayn", "Zayne", "Ze", "Zechariah", "Zeek", "Zeeshan", "Zeid", "Zein", "Zen", "Zendel", "Zenith", "Zennon", "Zeph", "Zerah", "Zhen", "Zhi", "Zhong", "Zhuo", "Zi", "Zidane", "Zijie", "Zinedine", "Zion", "Zishan", "Ziya", "Ziyaan", "Zohaib", "Zohair", "Zoubaeir", "Zubair", "Zubayr", "Zuriel"]
let last_names = ['Abbott',  'Acosta',    'Adams',    'Adkins',      'Albert',    'Alford',    'Allen',    'Allison',    'Alston',     'Alvarez',    'Anderson',    'Andrews',    'Anthony',       'Arnold',    'Ashley',    'Atkins',    'Atkinson',    'Austin',    'Avery',    'Avila',    'Ayala',    'Ayers',    'Bailey',    'Baird',    'Baker',    'Baldwin',   'Ball',    'Ballard',    'Banks',    'Barber',    'Barker',    'Barlow',    'Barnes',    'Barnett',    'Barr',    'Barrera',    'Barrett',    'Barron',    'Barry',    'Bartlett',    'Barton',    'Bass',    'Bates',    'Battle',    'Bauer',    'Baxter',    'Beach',    'Bean',    'Beard',    'Beasley',    'Beck',    'Becker',    'Bell',    'Bender',    'Benjamin',    'Bennett',    'Benson',    'Bentley',    'Benton',    'Berg',    'Berger',    'Bernard',    'Berry',    'Best',    'Bird',    'Bishop',    'Black',    'Blackburn',    'Blackwell',    'Blair',    'Blake',    'Blanchard',    'Blankenship',    'Blevins',    'Bolton',    'Bond',    'Bonner',    'Booker',    'Boone',    'Booth',    'Bowen',    'Bowers',    'Bowman',    'Boyd',    'Burnett',    'Burns',    'Burris',    'Burt',   'Burton',    'Bush',   'Butler',    'Byers',    'Byrd',    'Cabrera',    'Cain',    'Calderon',    'Caldwell',    'Calhoun',   'Callahan',    'Camacho',   'Cameron',    'Campbell',    'Campos',    'Cannon',    'Cantrell',   'Cantu',   'Cardenas',   'Carey',   'Carlson',   'Carney',    'Carpenter',    'Carr',    'Carrillo',    'Carroll',    'Carson',    'Carter',    'Cobb',    'Cochran',    'Coffey',    'Cohen',    'Cole',    'Coleman',    'Collier',    'Collins',    'Colon',    'Combs',    'Daugherty',    'Davenport',    'David',   'Davidson',    'Davis',    'Dawson',    'Day',    'Dean',    'Decker',    'Dejesus',    'Delacruz',    'Delaney',    'Deleon',    'Delgado',    'Dennis',    'Diaz',    'Dickerson',    'Dickson',    'Dillard',    'Dillon',    'Dixon',    'Dodson',    'Dominguez',    'Donaldson',    'Donovan',    'Dorsey',    'Dotson',    'Douglas',    'Downs',    'Doyle',    'Drake',    'Dudley',   'Duffy',       'Foreman',   'Foster',    'Fowler',    'Fox',    'Francis',    'Franco',    'Frank',    'Franklin',    'Franks',    'Frazier',    'Frederick',   'Freeman',    'French',    'Frost',    'Fry',    'Frye',    'Fuentes',    'Fuller',    'Fulton',    'Gaines',    'Gallagher',    'Gallegos',    'Galloway',    'Gamble',    'Garcia',    'Gardner',    'Garner',    'Garrett',    'Garrison',    'Garza',    'Gates',    'Gay',    'Gentry',    'George',    'Gibbs',    'Gibson',    'Gilbert',    'Giles',    'Gill',    'Gillespie',    'Gilliam',    'Gilmore',    'Glass',    'Glenn',    'Higgins',    'Hill',    'Hines',    'Hinton',    'Hobbs',    'Hodge',    'Hodges',    'Hoffman',    'Hogan',    'Holcomb',    'Holden',    'Holder',    'Holland',    'Holloway',    'Holman',    'Holmes',    'Holt',    'Hood',    'Hooper',    'Hoover',    'Hopkins',    'Hopper',    'Horn',    'Horne',    'Horton',    'House',    'Houston',    'Howard',    'Howe',    'Howell',    'Leonard',    'Lester',    'Levine',    'Levy',    'Lewis',    'Lindsay',    'Lindsey',    'Little',    'Livingston',    'Lloyd',    'Logan',    'Long',    'Lopez',    'Lott',    'Love',    'Lowe',    'Lowery',    'Lucas',    'Luna',    'Lynch',    'Lynn',    'Lyons',    'Macdonald',    'Macias',    'Mack',    'Madden',    'Maddox',    'Maldonado',    'Malone',    'Mann',    'Manning',    'Marks',    'Mcdonald',    'Mcdowell',    'Mcfadden',    'Mcfarland',    'Mcgee',    'Mcgowan',    'Mcguire',    'Munoz',    'Murphy',    'Murray',    'Myers',    'Nash',    'Navarro',    'Neal',    'Nelson',    'Newman',    'Newton',    'Nguyen',    'Nichols',    'Nicholson',    'Nielsen',    'Nieves',    'Nixon',    'Noble',    'Noel',    'Nolan',    'Norman',    'Norris',    'Norton',    'Nunez',    'Obrien',    'Ochoa',    'Oconnor',    'Odom',    'Odonnell',    'Oliver',    'Olsen',    'Olson',    'Oneal',    'Oneil',    'Oneill',    'Reyes',    'Reynolds',    'Rhodes',    'Rice',    'Rich',    'Richard',    'Richards',    'Richardson',    'Richmond',    'Riddle',    'Riggs',    'Riley',    'Rios',    'Rivas',    'Rivera',    'Rivers',    'Roach',    'Robbins',    'Roberson',    'Roberts',    'Robertson',    'Robinson',    'Robles',    'Rocha',    'Rodgers',    'Rodriguez',    'Rodriquez',    'Rogers',    'Rojas',    'Rollins',    'Roman',    'Romero',    'Rosa',    'Rosales',    'Rosario',    'Rose',    'Ross',    'Roth',    'Rowe',    'Rowland',    'Roy',    'Ruiz',    'Rush',    'Russell',    'Russo',    'Rutledge',    'Ryan',    'Salas',    'Salazar',    'Salinas',    'Sampson',    'Sanchez',    'Sanders',    'Sandoval',    'Sanford',    'Santana',   'Santiago',    'Santos',    'Sargent',    'Saunders',    'Savage',    'Sawyer',    'Schmidt',    'Schneider',    'Schroeder',    'Schultz',    'Schwartz',    'Scott',    'Sears',    'Sellers',    'Serrano',    'Sexton',    'Shaffer',    'Shannon',    'Sharp',    'Sharpe',    'Shaw',    'Shelton',    'Shepard',    'Shepherd',    'Sheppard',    'Sherman',    'Shields',    'Short',    'Silva',    'Simmons',    'Simon',    'Simpson',    'Spencer',    'Stafford',    'Stanley',    'Stanton',    'Stark',    'Steele',    'Stein',    'Stephens',    'Stephenson',    'Stevens',    'Stevenson',    'Stewart',    'Stokes',   'Stone',   'Stout',    'Strickland',    'Strong',    'Stuart',    'Suarez',    'Sullivan',    'Summers',    'Sutton',    'Swanson',    'Sweeney',    'Sweet',    'Sykes',    'Talley',    'Tanner',    'Tate',    'Taylor',    'Terrell',    'Terry',    'Thomas',    'Thompson',    'Thornton',   'Tillman',    'Todd',    'Torres',    'Townsend',    'Tran',    'Travis',    'Trevino',    'Trujillo',    'Tucker',    'Turner',    'Tyler',    'Tyson',   'Underwood',    'Valdez',    'Valencia',    'Valentine',    'Valenzuela',    'Vance',    'Vang',    'Vargas',    'Vasquez',    'Vaughan',    'Vaughn',    'Vazquez',    'Vega',    'Velasquez',    'Velazquez',    'Velez',    'Villarreal',    'Vincent',   'Vinson',    'Wade',    'Wagner',    'Walker',    'Wall',    'Wallace',    'Waller',    'Walls',    'Walsh',    'Walter',    'Walters',    'Walton',    'Ward',    'Ware',    'Warner',    'Warren',    'Washington',    'Waters',    'Watkins',    'Watson',    'Watts',    'Weaver',    'Webb',    'Weber',    'Webster',    'Weeks',    'Weiss',    'Welch',    'Wells',    'West',    'Wheeler',    'Whitaker',    'White',    'Whitehead',    'Whitfield',    'Whitley',    'Whitney',    'Wiggins',    'Wilcox',    'Wilder',    'Wiley',    'Wilkerson',    'Wilkins',    'Wilkinson',    'William',    'Williams',    'Williamson',    'Willis',    'Wilson',    'Winters',    'Wise',    'Witt',    'Wolf',    'Wolfe',    'Wong',    'Wood',    'Woodard',    'Woods',    'Woodward',    'Wooten',    'Workman',    'Wright',    'Wyatt',    'Wynn',    'Yang',    'Yates',    'York',    'Young',    'Zamora',    'Zimmerman']
