import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Container, Button, Icon, Divider, Accordion, Card, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader, //RESPONSIBLE FOR THE INITIAL LOADING SCREEN & HENCE RENDERING WHATS SUPPOSED TO RENDER AFTER LOADING
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        
       
        this.CheckTotalJobs = this.CheckTotalJobs.bind(this)
    };

 
   
    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

     componentDidMount() {
        this.init();
     };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        //this.setState({ loaderData });//comment this      //<-- THIS LINE WAS GIVEN FROM THE START

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
           this.setState({ loaderData })        //<-- passing in a function into loadData
        )       
        
    }


    loadData(callback) {
        var link = 'https://talentservicestalent20220407181101.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here

        //ADDED
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired,                
            },            
            success: function (res) {
                this.setState({ loadJobs: res.myJobs, totalPages: Math.ceil(res.totalCount / 6) });
                callback()           //RESPONSIBLE FOR COMPLETING THE LOADING OF ALL DATA ON SCREEN & RENDERING THEM

                console.log(this.state.loadJobs) // to test if it hits

            }.bind(this),
            error: function (res) {
                console.log(res.status)
                callback()
            }
        })


    }

    CheckTotalJobs()
    {

        var CardRowStyle = {//to style the card 
            float: 'left',

        }

        var CardStyle = {//to style the card 
            display: "inline-block",
            textAlign: "center",
            margin: 20,
            height: 350,
            width: 500,
            padding: 0,
            backgroundColor: "#FFF",
            WebkitFilter: "drop-shadow(0px 0px 5px #555)",
            
        }
        var headerstyle = {//to style 
            
            textAlign: "left",
            marginLeft: 20,           
        }
        var LocationStyle = {//to style 
            
            textAlign: "left",
            marginLeft: 20,
            color: "lightgray"
        }
        var SummaryStyle = {//so the summary text is constrained within the specified params
            //which means the text is set to hidden if it exceeds the given params
            
            //textAlign: "justified",
                       
            overflow: "hidden",          
            height: 200,
            width: 450,           
        }

        var BottomRowStyle = {//to style 
            marginTop: 15,
            textAlign: "left",
            marginLeft: 20,
            color: "lightgray"
        }
        
        var FirstButton = {
            width: 110,
            float: 'left',      //this button will be on the left
        }

        var ButtonOne= {
            width: 108,
            float: 'right',     //this button will be on the right
        }
        var ButtonTwo = {
            width: 100,
            float: 'right',     //this button will be on the right
        }
        var ButtonThree = {
            width: 100,
            float: 'right',     //this button will be on the right
        }
        var cardlist = (this.state.loadJobs).map((iter)=>
        {
            
            return (
                
                <div key={iter.id}>

                    <div className="row" >
                        <div className="column" style={CardRowStyle}>
                            <Card style={CardStyle}>
                                <h2 style={headerstyle} >{iter.title}</h2>
                                <p style={LocationStyle}><b>{iter.location.city, iter.location.country}</b></p>
                                <Container fluid textAlign='justified' style={SummaryStyle}>
                                    <p>
                                        {iter.summary}
                                    </p>
                           
                                </Container>

                        
                                <Divider fitted />
                                <div className="row" style={BottomRowStyle}>
                                    <div className="column" style={FirstButton}> <Button color='red'>Expired</Button></div>
                                                                    
                                    <div className="column" style={ButtonTwo}>  <Button basic color='blue'><Icon name='edit outline' /> Edit</Button></div>
                                    <div className="column" style={ButtonThree}>  <Button basic color='blue'><Icon name='copy outline' /> Copy</Button></div>
                                    <div className="column" style={ButtonOne}>  <Button basic color='blue'><Icon name='ban' /> Close</Button></div>

                                </div>
                       
                            </Card>
                        </div>
                    </div>
                </div>
            )
        })
       
                  
        

        if (this.state.loadJobs.length == 0) {
            return (<p> No Jobs Found</p>)
        }
        else if (this.state.loadJobs.length > 0){

            return ( cardlist)
        }
        
    }

    render() {
       
       var style ={             

           paddingLeft: 100,
           paddingBottom: 100,  //ADDED
           paddingTop: 500,      //ADDED
       }


        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                
                
               <Container>
                    <h1> List of Jobs</h1>
                    
                    <i aria-hidden="true" className="filter disabled icon"></i> Filter:<b>Choose Filter</b> <i aria-hidden="true" className="dropdown icon"></i><i aria-hidden="true" className="calendar plus outline icon"></i>Sort by date: <b> Newest first</b><i aria-hidden="true" className="dropdown icon"></i>
                    
                            {this.CheckTotalJobs()}
                   
                </Container>

                <Container style={style}>
                    <Pagination defaultActivePage={1} totalPages={this.state.loadJobs.length} />
                    
                </Container>


               
            </BodyWrapper>
        )
    }

    
      
    
}