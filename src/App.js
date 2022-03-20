import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import ScrollToTop from "./components/Scroll/ScrollToTop";
import Header from './components/Header/Header.js';
import NewsHeadlines from './page/NewsHeadlines/NewsHeadlines.js';
import NewsEverything from './page/NewsEverything/NewsEverything.js';
import NotFound from './components/NotFound/NotFound.js';
import Popup from "./components/Popup";
import './assets/scss/main.scss';

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            disclaimerAccepted: localStorage.getItem("disclaimerAccepted") === "true" ? true : false
        }
    }

    handleDisclaimerAccept = () => {
        localStorage.setItem("disclaimerAccepted", "true");
        document.body.style.overflow = '';
        this.setState({disclaimerAccepted: true});
    }

    render() {
        const pageHeadlines = "headlines",
        pageEverything = "everything",
        pageNotFound = "404",
        pages = [
            pageHeadlines,
            pageEverything
        ];

        return (
            <Router>
                <Header pages={pages}/>
                <Switch>
                    <Route exact path={`/${pageHeadlines}`}>
                        <ScrollToTop/>
                        <NewsHeadlines/>
                    </Route>
                    <Route exact path={`/${pageEverything}`}>
                        <ScrollToTop/>
                        <NewsEverything/>
                    </Route>
                    <Route exact path={`/${pageNotFound}`}>
                        <ScrollToTop/>
                        <NotFound/>
                    </Route>
                    <Route exact path={`/`}>
                        <Redirect to={`/${pageHeadlines}`}/>
                    </Route>
                    <Route path="*">
                        <Redirect to={`/${pageNotFound}`}/>
                    </Route>
                </Switch>
            {
            /*
                <Footer/>
            */
            }
            {
                this.state.disclaimerAccepted ? null : <Popup handleAccept={this.handleDisclaimerAccept} />
            }
            </Router>
        );
    }
}

export default App