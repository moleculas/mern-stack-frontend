import React, { Component } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import { apiUrl } from "../constantes";

export default class CreateNote extends Component {

        state = {
        title: '',
        content: '',
        date: new Date(),
        userSelected: '',
        users: [],
        editing: false,
        _id: ''
    }

    async componentDidMount() {
        const res = await axios.get(apiUrl+'/api/users');
        if (res.data.length > 0) {
            this.setState({
                users: res.data.map(user => user.username),
                userSelected: res.data[0].username
            })
        }
        if (this.props.match.params.id) {
            console.log(this.props.match.params.id)
            const res = await axios.get(apiUrl+'/api/notes/' + this.props.match.params.id);
            console.log(res.data)
            this.setState({
                title: res.data.title,
                content: res.data.content,
                date: new Date(res.data.date),
                userSelected: res.data.author,
                _id: res.data._id,
                editing: true
            });
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();
        if (this.state.editing) {
            const updatedNote = {
                title: this.state.title,
                content: this.state.content,
                author: this.state.userSelected,
                date: this.state.date
            };
            await axios.put(apiUrl+'/api/notes/' + this.state._id, updatedNote);
        } else {
            const newNote = {
                title: this.state.title,
                content: this.state.content,
                author: this.state.userSelected,
                date: this.state.date
            };
            axios.post(apiUrl+'/api/notes', newNote);
        }
        window.location.href = '/';

    }

    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeDate = date => {
        this.setState({ date });
    }
  
    render() {
        return (
            <div className="col-md-6 offset-md-3 mt-5">
            <div className="card card-body">
                <h4>Create a Note</h4>
                <form onSubmit={this.onSubmit}>
                    {/* SELECT THE USER */}
                    <div className="form-group mt-3 mb-2">
                        <select
                            className="form-select"
                            value={this.state.userSelected}
                            onChange={this.onInputChange}
                            name="userSelected"
                            required>                             
                            {
                                this.state.users.map(user => (
                                    <option key={user} value={user}>
                                        {user}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    {/* Note Title */}
                    <div className="form-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            onChange={this.onInputChange}
                            name="title"
                            value={this.state.title}
                            required />
                    </div>
                    {/* Note Content */}
                    <div className="form-group mb-2">
                        <textarea
                            type="text"
                            className="form-control"
                            placeholder="Content"
                            name="content"
                            onChange={this.onInputChange}
                            value={this.state.content}
                            required>
                        </textarea>
                    </div>
                    {/* Note Date */}
                    <div className="form-group mb-2">
                        <DatePicker className="form-control col-12" selected={this.state.date} onChange={this.onChangeDate} />
                    </div>
                    <button className="btn btn-primary col-12">
                        Save <i className="material-icons">
                            assignment
</i>
                    </button>
                </form>
            </div>
        </div>
        )
    }
}
