import React, { Component } from 'react'
import { Link, NavLink, Route, Router, Switch } from 'react-router-dom'
import { Grid, Item, Menu, MenuMenu, Menu as Menuu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditTodo } from './components/EditTodo'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Todos } from './components/Todos'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <div style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    )
  }

  generateMenu() {
    return (<Menu>
      <MenuMenu>
        <Item name="home">
          <Link to="/">Home</Link>
        </Item>

        <MenuMenu position="right">{this.logInLogOutButton()}</MenuMenu>
      </MenuMenu>
    </Menu>)
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Item>
      )
    } else {
      return (
        <Item name="login" onClick={this.handleLogin}>
          Log In
        </Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (<div>
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Todos {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/todos/:todoId/edit"
          exact
          render={props => {
            return <EditTodo {...props} auth={this.props.auth} />
          }}
        />

        <Route render={()=><NotFound/>} />
      </Switch></div>
    )
  }
}
