import React, { Component } from 'react'
import axios from 'axios'
import { apiUrl } from "../constantes"

export default class CreateUser extends Component {

    state = {
        username: '',
        users: []
    }
    async componentDidMount() {
        this.getUsers();
    }

    getUsers = async () => {
        const res = await axios.get(apiUrl+'/api/users');
        this.setState({
            users: res.data
        });
    }

    onChangeUsername = e => {
        this.setState({
            username: e.target.value
        })
    }

    onSubmit = async (e) => {
        e.preventDefault();
        await axios.post(apiUrl+'/api/users', {
            username: this.state.username
        });
        this.setState({ username: '' });
        this.getUsers();
    }

    deleteUser = async (userId) => {
        const response = window.confirm('are you sure you want to delete it?');
        if (response) {
            await axios.delete(apiUrl+'/api/users/' + userId);
            this.getUsers();
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row mt-5 d-flex justify-content-between">
                    <div className="col-md-4">
                        <div className="card card-body">
                            <h3>Create New User</h3>
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <input
                                        className="form-control"
                                        value={this.state.username}
                                        type="text"
                                        onChange={this.onChangeUsername}
                                    />
                                </div>                                
                                    <button type="submit" className="btn btn-primary mt-2 col-12">
                                        Save
                                     </button>                               
                            </form>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <ul className="list-group">
                            {
                                this.state.users.map(user => (
                                    <li className="list-group-item list-group-item-action" key={user._id} onDoubleClick={() => this.deleteUser(user._id)}>
                                        {user.username}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
