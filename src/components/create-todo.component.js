import React, { Component } from 'react';
import AWS from 'aws-sdk';

export default class CreateTodo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_message: '',
            todo_completed: false
        }
        this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
        this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
        this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
        this.onChangeTodoMessage = this.onChangeTodoMessage.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create New Todo</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>Description: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.todo_description}
                                onChange={this.onChangeTodoDescription}
                                />
                    </div>
                    <div className="form-group">
                        <label>Responsible: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.todo_responsible}
                                onChange={this.onChangeTodoResponsible}
                                />
                    </div>
                    <div className="form-group">
                        <div className="form-check form-check-inline">
                            <input  className="form-check-input" 
                                    type="radio" 
                                    name="priorityOptions" 
                                    id="priorityLow" 
                                    value="Low"
                                    checked={this.state.todo_priority==='Low'} 
                                    onChange={this.onChangeTodoPriority}
                                    />
                            <label className="form-check-label">Low</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input  className="form-check-input" 
                                    type="radio" 
                                    name="priorityOptions" 
                                    id="priorityMedium" 
                                    value="Medium" 
                                    checked={this.state.todo_priority==='Medium'} 
                                    onChange={this.onChangeTodoPriority}
                                    />
                            <label className="form-check-label">Medium</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input  className="form-check-input" 
                                    type="radio" 
                                    name="priorityOptions" 
                                    id="priorityHigh" 
                                    value="High" 
                                    checked={this.state.todo_priority==='High'} 
                                    onChange={this.onChangeTodoPriority}
                                    />
                            <label className="form-check-label">High</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Message: </label>
                        <input 
                                type="text" 
                                className="form-control"
                                value={this.state.todo_message}
                                onChange={this.onChangeTodoMessage}
                                />
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Create Todo" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }

    onChangeTodoDescription(e) {
        this.setState({
            todo_description: e.target.value
        });
    }

    onChangeTodoResponsible(e) {
        this.setState({
            todo_responsible: e.target.value
        });
    }

    onChangeTodoPriority(e) {
        this.setState({
            todo_priority: e.target.value
        });
    }

    onChangeTodoMessage(e) {
        this.setState({
            todo_message: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'eu-west-2:beda143a-1088-45f8-80bf-8f89601226ae',
        });
        AWS.config.update({region: 'eu-west-2'});
        var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

        var params = {
            // Remove DelaySeconds parameter and value for FIFO queues
           DelaySeconds: 10,
           MessageAttributes: {
             "Description": {
               DataType: "String",
               StringValue: this.state.todo_description
             },
             "Priority": {
               DataType: "String",
               StringValue: this.state.todo_priority
             },
             "Responsible": {
                DataType: "String",
                StringValue: this.state.todo_responsible
              }
           },
           MessageBody: this.state.todo_message,
           // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
           // MessageGroupId: "Group1",  // Required for FIFO queues
           QueueUrl: "https://sqs.eu-west-2.amazonaws.com/549313309072/reactTest"
         };
           
         sqs.sendMessage(params, function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data.MessageId);
            }
          });

        console.log(`Form submitted:`);
        console.log(`Todo Description: ${this.state.todo_description}`);
        console.log(`Todo Responsible: ${this.state.todo_responsible}`);
        console.log(`Todo Priority: ${this.state.todo_priority}`);
        console.log(`Todo Message: ${this.state.todo_message}`);
        
        this.setState({
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_message: '',
            todo_completed: false
        })
    }
}