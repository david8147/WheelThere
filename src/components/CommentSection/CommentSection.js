import React, {Component} from 'react';
import './CommentSection.css';
import * as firebase from "firebase";
import StarRatings from 'react-star-ratings';
import AuthUserContext from '../../components/auth/AuthUserContext';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

// debugging: part by part: first see if comments load if it worked by hardcoding comments in

let elemm = [];

let USER = "";

export class CommentSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newComment: null,
            tripId: this.props.tripId,
            thisTripCommentData: null,
            thisTripCommentDataRender: null,
            numStars: 0,
            userId: null,
            temp: null,

            dropdownOpen: false,
            droDownText: "Sort By"

        };
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    componentDidMount() {
        let userId = null;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                userId = user.uid;
                // User is signed in.
                USER = user.uid;
            }
        });

        let tempTripComments = [];

        let userRef = firebase.firestore().collection('comments').where('tripId', '==', this.state.tripId);
        userRef.get().then((values) => {
            values.forEach((doc) => {
                // console.log(doc);
                let elem = doc.data();
                // console.log(doc.id);
                elem.commentId = doc.id;
                // console.log(elem);
                tempTripComments.push(elem);
                // tempTripComments.push(doc.data());

            })
        }).then(() => {   // chaining firebase thens...
            tempTripComments.sort(this.compare);
            this.setState({thisTripCommentData: tempTripComments},
                () => this.getAllComments());
        });
    }

    oldestTime = () => {
        if (this.state.thisTripCommentDataRender != null) {
            let elem = this.state.thisTripCommentDataRender;
            elem.sort(this.compareTimeOldest);
            this.setState({thisTripCommentDataRender: elem, droDownText: "Oldest"})
        }
    }
    newestTime = () => {
        if (this.state.thisTripCommentDataRender != null) {
            let elem = this.state.thisTripCommentDataRender;
            elem.sort(this.compareTimeNewest);
            this.setState({thisTripCommentDataRender: elem, droDownText: "Newest"})
        }
    }
    compareTimeOldest = (a, b) => {
        if (a.props == null && b.props == null) return 0;
        if (a.props == null) return 1;
        if (b.props == null) return -1;
        if (a.props.children[4].props.children < b.props.children[4].props.children)
            return -1;
        if (a.props.children[4].props.children > b.props.children[4].props.children)
            return 1;
        return 0;
    }
    compareTimeNewest = (a, b) => {
        if (a.props == null && b.props == null) return 0;
        if (a.props == null) return -1;
        if (b.props == null) return 1;
        if (a.props.children[4].props.children < b.props.children[4].props.children)
            return 1;
        if (a.props.children[4].props.children > b.props.children[4].props.children)
            return -1;
        return 0;
    }
    compareMostStars = (a, b) => {
        if (a.props == null && b.props == null) return 0;
        if (a.props == null) return 1;
        if (b.props == null) return -1;
        if (parseInt(a.props.children[2].props.children) < parseInt(b.props.children[2].props.children))
            return 1;
        if (parseInt(a.props.children[2].props.children) > parseInt(b.props.children[2].props.children))
            return -1;
        return 0;
    }
    compareLeastStars = (a, b) => {
        if (a.props == null && b.props == null) return 0;
        if (a.props == null) return -1;
        if (b.props == null) return 1;
        if (parseInt(a.props.children[2].props.children) < parseInt(b.props.children[2].props.children))
            return -1;
        if (parseInt(a.props.children[2].props.children) > parseInt(b.props.children[2].props.children))
            return 1;
        return 0;
    }
    leastStars = () => {
        if (this.state.thisTripCommentDataRender != null) {
            let elem = this.state.thisTripCommentDataRender;
            elem.sort(this.compareLeastStars);
            this.setState({thisTripCommentDataRender: elem, droDownText: "Fewest Stars"})
        }
    }
    mostStars = () => {
        if (this.state.thisTripCommentDataRender != null) {
            let elem = this.state.thisTripCommentDataRender;
            elem.sort(this.compareMostStars);
            this.setState({thisTripCommentDataRender: elem, droDownText: "Most Stars"})
        }
    }
    mostLiked = () => {
        if (this.state.thisTripCommentDataRender != null) {
            let elem = this.state.thisTripCommentDataRender;
            elem.sort(this.compareMostLiked);
            this.setState({thisTripCommentDataRender: elem, droDownText: "Most Liked"})
        }
    }
    leastLiked = () => {
        if (this.state.thisTripCommentDataRender != null) {
            let elem = this.state.thisTripCommentDataRender;
            elem.sort(this.compareLeastLiked);
            this.setState({thisTripCommentDataRender: elem, droDownText: "Least Liked"})
        }
    }
    compareMostLiked = (a, b) => {
        if (a.props == null && b.props == null) return 0;
        if (a.props == null) return -1;
        if (b.props == null) return 1;
        if ((a.props.children[1].props.children) < (b.props.children[1].props.children))
            return 1;
        if ((a.props.children[1].props.children) > (b.props.children[1].props.children))
            return -1;
        return 0;
    }
    compareLeastLiked = (a, b) => {
        if (a.props == null && b.props == null) return 0;
        if (a.props == null) return 1;
        if (b.props == null) return -1;
        if ((a.props.children[1].props.children) < (b.props.children[1].props.children))
            return -1;
        if ((a.props.children[1].props.children) > (b.props.children[1].props.children))
            return 1;
        return 0;
    }
    deleteButtonClicked=(comment)=>{
        console.log(comment);
        let userRef = firebase.firestore().collection('comments').doc(comment.commentId);
        userRef.delete().then(function() {
            console.log(comment.commentId);
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        let userRef_1 = firebase.firestore().collection('users').doc(USER);
        let oldComments = [];
        userRef_1.get().then((data)=>{
            oldComments = data.data().comments;
            oldComments.splice(oldComments.indexOf(comment.commentId), 1 );
        }).then(()=>{
            userRef_1.update({comments: oldComments}).then(()=>{
                window.location.reload();
            })
        })
    }
    getAllComments = () => {
        if (this.state.thisTripCommentData != null && this.state.thisTripCommentData.length != 0) {
            // console.log(this.state.thisTripCommentData);

            let comments = this.state.thisTripCommentData.map((comment) => {
                // console.log(comment)
                let alreadyLiked = "Like";
                let likedUsersCheck = comment.likedUsers;
                if(likedUsersCheck == null || likedUsersCheck.length == 0)
                {

                }
                else{
                    for(let i = 0; i < likedUsersCheck.length; i++)
                    {
                        if(USER != "" && likedUsersCheck[i] == USER)
                            alreadyLiked = "LIKED";
                    }

                }
                // console.log(comment);
                return (
                    <div id="border">

                        <button id={comment.commentId} onClick={()=>this.likeButtonClicked(comment.commentId)}>{alreadyLiked}</button>
                        <p id = {comment.commentId+"num"}>Likes: {comment.likedUsers.length}</p>
                        <p id="stars">Stars: {comment.stars}</p>
                        <p>Comment: {comment.text}</p>
                        <p>Timestamp: {comment.timeStamp.toString()}</p>
                        <p>TripId:{comment.tripId}</p>
                        <p>UserId: {comment.userId}</p>
                        <AuthUserContext.Consumer>
                            {authUser => authUser &&  comment.userId == USER
                                ? <button onClick={()=>this.deleteButtonClicked(comment)}>Delete Comment</button>
                                : null}
                        </AuthUserContext.Consumer>
                    </div>
                );
            });
            this.setState({thisTripCommentDataRender: comments}, () => {
                // console.log(this.state.thisTripCommentDataRender)
            });
        }
    }
    likeButtonClicked = (commentId) => {
        if (document.getElementById(commentId).innerHTML == "LIKED")
        {
            document.getElementById(commentId).innerHTML = "like";
            let i = document.getElementById(commentId+"num").innerHTML;
            i = i.charAt(i.length-1);
            let j = parseInt(i)- 1;
            document.getElementById(commentId+"num").innerHTML = "Likes: "+j;
            let likedUsers = [];
            let userComments = [];
            let userRef = firebase.firestore().collection('comments').doc(commentId);
            userRef.get().then((data)=>{
                likedUsers = data.data().likedUsers;
                likedUsers.splice(likedUsers.indexOf(USER), 1 );
            }).then(()=>{
                userRef.update({likedUsers: likedUsers})
            })

            let userRef_1 = firebase.firestore().collection('users').doc(USER);
            userRef_1.get().then((data)=>{
                userComments = data.data().likedComments;
                userComments.splice(userComments.indexOf(commentId), 1 );
            }).then(()=>{
                userRef_1.update({likedComments: userComments})
            })
        }
        else{
            console.log(commentId);
            let elem = [];
            let userLikedComments = [];
            let userRef = firebase.firestore().collection('comments').doc(commentId);
            let userRef_1 = firebase.firestore().collection('users').doc(USER);
            userRef_1.get().then((data)=>{
                userLikedComments = data.data().likedComments
            })

            userRef.get().then((data) => {
                elem = data.data().likedUsers;
                if(elem == null || elem.length == 0){
                    elem = [];
                    elem.push(USER);
                }

                else if(!(USER in elem))
                {
                    elem.push(USER);

                }
                if(!(commentId in userLikedComments))
                {
                    userLikedComments.push(commentId);
                    // console.log(userLikedComments)
                }


            }).then(()=>{
                // console.log(elem);
                // console.log(USER);

                document.getElementById(commentId).innerHTML = "LIKED";
                let i = document.getElementById(commentId+"num").innerHTML;
                i = i.charAt(i.length-1);
                let j = parseInt(i)+ 1;
                document.getElementById(commentId+"num").innerHTML = "Likes: "+j;
                userRef.update({likedUsers: elem});
                userRef_1.update({likedComments: userLikedComments}).then(()=>{
                    console.log(userLikedComments)
                    // window.location.reload();
                })
            })
        }

    }
    addCommentData = (data, commentDocRefId) => {
        console.log(data);
        console.log(this.state.temp);
        let currentCommentData = this.state.thisTripCommentDataRender;
        if (currentCommentData == null)
            currentCommentData = [];

        let newDiv = (<div id="border">
            <button id="likebutton" onClick={this.likeButtonClicked}>Like</button>
            <p>Likes {this.state.temp.likedUsers.length}</p>
            <p id="stars">Stars: {this.state.temp.stars} </p>
            <p>Comment: {this.state.temp.text}</p>
            <p>Timestamp: {this.state.temp.timeStamp.toString()}</p>
            <p>TripId: {this.state.temp.tripId}</p>
            <p>UserId: {this.state.temp.userId}</p>
        </div>);
        // console.log(JSON.stringify(newDiv));
        currentCommentData.push(newDiv);
        this.setState({thisTripCommentDataRender: currentCommentData}, () => {
            // console.log(this.state.thisTripCommentData)
            window.location.reload();
        })
    }




    addComment = (e) => {
        if(USER == "")
        {
            e.preventDefault();
            alert("You Have To Log In First");
        }
        else
        {
            e.preventDefault();
            var currentDate = new Date();
            // put to db
            // Add a new document with a generated id.
            let userRef = firebase.firestore().collection('comments');
            let userRef_1 = firebase.firestore().collection('trips').doc(this.state.tripId);
            let userRef_2 = firebase.firestore().collection('users').doc(USER);


            let that = this;
            let docRefId = null;
            userRef.add({
                likedUsers: [],
                stars: this.state.numStars,
                text: this.state.newComment,
                timeStamp: currentDate,
                tripId: this.state.tripId,
                userId: USER,
            }).then(function (docRef) {
                docRefId = docRef.id;
                // console.log(docRef.id)
                userRef_1.get().then((trip) => {
                    let elem = trip.data().commentIds;
                    if (elem == null)
                        elem = [];
                    // console.log("docRefId "+docRefId)
                    elem.push(docRefId);
                    userRef_1.update({commentIds: elem})
                }).then(() => {
                    userRef_2.get().then((user) => {
                        let elem = user.data().comments;
                        if (elem == null)
                            elem = [];
                        elem.push(docRef.id)
                        userRef_2.update({comments: elem}).then(() => {
                            that.setState({
                                temp: {
                                    likedUsers: [],
                                    stars: that.state.numStars,
                                    text: that.state.newComment,
                                    timeStamp: currentDate,
                                    tripId: that.state.tripId,
                                    userId: USER,
                                }
                            }, () => {
                                that.addCommentData({
                                    likedUsers: [],
                                    stars: that.state.numStars,
                                    text: that.state.newComment,
                                    timeStamp: currentDate,
                                    tripId: that.state.tripId,
                                    userId: USER
                                });
                            })
                        })
                        // e.preventDefault();
                    })
                })


                // console.log("Document written with ID: ", docRef.id);
            });
        }



        // var tripList = [];
        // // const db = firebase.firestore();
        // // const userRef = db.collection('users').doc(this.state.userId);
        //
        // this.userRef.get().then((user)=>{
        //     if(user.data()!=null)  tripList = user.data().places;
        //
        //     tripList.push(this.state.newPlace);
        // }).then(()=>{
        //     this.userRef.set({places:tripList})
        // }).then(()=>{
        //     this.setState({places:tripList});
        //     e.preventDefault();
        // })
    };

    render() {
        return (
            <div>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle caret>
                        {this.state.droDownText}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>
                            <div onClick={this.oldestTime}>Oldest</div>
                        </DropdownItem>
                        <DropdownItem>
                            <div onClick={this.newestTime}>Newest</div>
                        </DropdownItem>
                        <DropdownItem>
                            <div onClick={this.mostStars}>Most Stars</div>
                        </DropdownItem>
                        <DropdownItem>
                            <div onClick={this.leastStars}>Least Stars</div>
                        </DropdownItem>
                        <DropdownItem>
                            <div onClick={this.mostLiked}>Most Liked</div>
                        </DropdownItem>
                        <DropdownItem>
                            <div onClick={this.leastLiked}>Least Liked</div>
                        </DropdownItem>

                    </DropdownMenu>
                </Dropdown>
                {this.state.dropdownOpen}
                <div>
                    {this.state.thisTripCommentDataRender}
                </div>
                <AuthUserContext.Consumer>
                    {authUser => authUser
                        ? <form onSubmit={this.addComment}>
                            <StarRatings
                                isSelectable="true"
                                changeRating={(rating) => {
                                    this.setState({numStars: rating})
                                }}
                                starHoverColor='rgb(230, 67, 47)'
                                rating={this.state.numStars}
                                starRatedColor="blue"
                                starDimension="15px"
                                starSpacing="0px"
                                numberOfStars={5}
                                name='rating'
                            />
                            <br/>
                            <label> Add a Comment</label>
                            <input onChange={e => this.setState({newComment: e.target.value})} type="text"
                                   className="form-control" placeholder="Add a Comment"/>
                            <button type="submit">Add Comment</button>
                        </form>
                        : null}
                </AuthUserContext.Consumer>

            </div>
        );
    }
}

export default CommentSection;

