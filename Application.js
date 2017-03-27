class Application extends React.Component {
    constructor() {
        super();
        this.fetchResources = this.fetchResources.bind(this);
        this.sortByRecentPoints = this.sortByRecentPoints.bind(this);
        this.sortByAlltimePoints = this.sortByAlltimePoints.bind(this);
        this.state = {
            users: [],
            sortByRecent: true,
            isFetching: true,
            fetchError: null
        };
    }

    // initiate initial fetch
    componentDidMount() {
        this.fetchResources(true);
    }

    // fetch data
    fetchResources(sortByRecent) {
        let url = sortByRecent ?
                this.props.recent : this.props.alltime;

        fetch(url)
            .then((res) => res.json())
            .then((users) => {
                this.setState({
                    users,
                    sortByRecent,
                    isFetching: false,
                    fetchError: null
                });
            }).catch((err) => {
                this.setState({
                    users: [],
                    sortByRecent,
                    isFetching: false,
                    fetchError: err
                });
            });
    }

    // change sorting to recent
    sortByRecentPoints() {
        if(!this.state.sortByRecent) {
            this.fetchResources(true);
        }
    }

    // change sorting to alltime
    sortByAlltimePoints() {
        if(this.state.sortByRecent) {
            this.fetchResources(false);
        }
    }

    render() {
        let content;
        // render spinner if loading is in progress
        if (this.state.isFetching) {
            content = <div className='loading'>
                <i className='loading fa fa-refresh fa-spin fa-3x' />
            </div>;
        // render error message if fetch failed
        } else if(!this.state.isFetching && this.state.fetchError) {
            content = <p>{this.state.fetchError}</p>;
        // render userlist if fetch completed succesfully
        } else {
            content = <Leaderboard
                users={this.state.users}
                sortByRecent={this.state.sortByRecent}
                sortByRecentPoints={this.sortByRecentPoints}
                sortByAlltimePoints={this.sortByAlltimePoints}
            />;
        }

        return (
            <div className='leaderboard'>
                <div className='leaderboard-head'>
                    <h2>Leaderboard</h2>
                </div>
                {content}
            </div>
        );
    }
}

// render leaderboard content
function Leaderboard(props) {
    // create instance of User component for every array index
    const userRows = props.users.map((user, i) => {
        return (
            <User
                rank={i + 1}
                username={user.username}
                imgUrl={user.img}
                recentPoints={user.recent}
                allTimePoints={user.alltime}
            />
        );
    });

    return (
        <table>
            <tr className='table-head'>
                <th>#</th>
                <th>Camper</th>
                <th onClick={props.sortByRecentPoints}>
                    Points in past 30 days
                    {props.sortByRecent &&
                        <i className='toggle fa fa-caret-down'/>
                    }
                </th>
                <th onClick={props.sortByAlltimePoints}>
                    All time points
                    {!props.sortByRecent &&
                        <i className='toggle fa fa-caret-down'/>
                    }
                </th>
            </tr>
            {userRows}
        </table>
    );
}

// render individual row of leaderboard
function User(props) {
    return (
        <tr className='user-row'>
            <td className='rank'>
                {props.rank}
            </td>
            <td className='user'>
                <img className='user-avatar'
                    src={props.imgUrl}
                    alt={props.username + '\'s avatar'}
                />
                <h2 className='username'>{props.username}</h2>
            </td>
            <td className='points-in-past-thirty-days'>
                {props.recentPoints}
            </td>
            <td className='points-all-time'>
                {props.allTimePoints}
            </td>
        </tr>
    );
}


ReactDOM.render(
    <Application
       recent={'https://fcctop100.herokuapp.com/api/fccusers/top/recent'}
       alltime={'https://fcctop100.herokuapp.com/api/fccusers/top/alltime'}
    />,
    document.getElementById('app')
);
