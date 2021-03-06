import React from "react";
import CustomHead from "../../../partials/content/CustomHeader.js";
import {Button, Modal, Form, Col} from "react-bootstrap";
import { Link, withRouter } from 'react-router-dom'
import {list, patch, MEDIA_URL, USER_URL} from "../../../crud/api";
import {Paper, Grid} from "@material-ui/core";
import EasyEdit from 'react-easy-edit';
import Notice from "../../../partials/content/Notice";


class Detail extends React.Component {

  constructor(props) {
    super(props);
    const { wanted_id, type } = this.props.data.match.params
    const divStyle = {
      padding : '15px'
    };
    this.txt_weight = {fontWeight:500}
    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.confirm = this.confirm.bind(this);
    this.state = {
      type : type,
      wanted:{},
      action:'',
      showModal: false,
      created_at: '',
      updated_at: '',
      is_published: ''

    };
    this.getWanted(wanted_id);
    this.divStyle = divStyle;
  }

  getWanted(wanted_id) {
    list('wanteds/'+wanted_id+'/').then(
      (response) => {
          delete response.data.type;
          this.setState({
              created_at : new Intl.DateTimeFormat().format(new Date(response.data.created_at)),
              updated_at : new Intl.DateTimeFormat().format(new Date(response.data.updated_at)),
          });
          this.setState({wanted : response.data})
    });
  }

  handleChange(val, attr) {
    var wanted = this.state.wanted;

    wanted[attr] = val;
    this.setState({wanted : wanted})
    patch('wanteds/'+this.state.wanted.id+'/', this.state.wanted).then(
      (response) => {
        this.setState({wanted : response.data});
    }).catch(error => {
        this.props.sendError(error.response.data);
    });
  }

  handleModalShow(event, action) {
    var val = event.target.value;
    if (action === 'status'){
      val = parseInt(val);
      this.setState({is_published : val === 1 ? 0:1})
    }
    this.setState({action: action});
    this.setState({ showModal: true });
  }

  handleModalClose() {
   this.setState({ showModal: false });
  }

  confirm() {
    if(this.state.action === 'status') {
      this.state.wanted.is_published = this.state.is_published;
      patch('wanteds/'+this.state.wanted.id+'/', {is_published: this.state.is_published}).then(
        (response) => {
          delete response.data.type;
          this.setState({wanted : response.data});
          this.setState({showModal : false});
      }).catch(error => {
          this.props.sendError(error.response.data);
          this.setState({showModal : false});
      });
    }
  }



  render() {
    const { wanted } = this.state;
    return (
        <div>
          <Grid container spacing={3}>
                <Grid item xs={12} md={9}>
                  <Form>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Wanted Asset</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{wanted.type_0 ? wanted.type_0.type : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>User</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{wanted.primary_contact ? wanted.primary_contact.first_name+" "+wanted.primary_contact.last_name : '-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Aircraft Manfacturer</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{wanted.manufacturer ? wanted.manufacturer.name: '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Aircraft Type</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{wanted.type_0 ? wanted.type_0.name :'-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Aircraft Model</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{wanted.model ? wanted.model.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>YOM</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{wanted.yom ? wanted.yom : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Primary Contact</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{wanted.primary_contact ? wanted.primary_contact.first_name+" "+wanted.primary_contact.last_name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Location</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{wanted.country ? wanted.country.name : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Wanted By</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{wanted.wanted_by ? wanted.wanted_by : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Wanted Terms</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{wanted.terms ? wanted.terms : '-----'}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} md="6" xs="12">
                      <Form.Label>Comments</Form.Label><br/>
                      <Form.Label style={this.txt_weight}>{wanted.comments ? wanted.comments : '-----'}</Form.Label>
                    </Form.Group>
                  </Form.Row>
                  <Form.Group>
                      <Form.Label>Status</Form.Label><br/>
                      <span onClick={(e) => this.handleModalShow(e,'status')} className={this.state.wanted.is_published === 1 ? 'kt-switch kt-switch--sm kt-switch--success':'kt-switch kt-switch--sm kt-switch--danger'}>
                        <label>
                          <input
                            type="checkbox" checked={wanted.is_published === 1 ? 'defaultChecked':''}
                            value={wanted.is_published === 1 ? '1' : '0'}
                            name="is_published"
                          />
                          <span />
                        </label>
                      </span>
                    </Form.Group>
                    <Form.Group>
                      <Link to={"/"+USER_URL+"/wanted/asset/"+wanted.id+"/edit"} className="btn btn-primary">
                        <i className="la la-edit" />
                        Edit
                      </Link>
                    </Form.Group>
                  </Form>
                </Grid>
            </Grid>

          <Modal show={this.state.showModal} onHide={this.handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button variant="danger" onClick={this.confirm}>
                Yes
              </Button>
              <Button variant="success" onClick={this.handleModalClose}>
                No
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
  }
}

class DetailPage extends React.Component {
  constructor(props) {
    super(props);
    let type = props.match.params.type;
    this.state = {errors:{}, showError:false};
    this.state.type = type;
    this.sendError = this.sendError.bind(this);
  }

  sendError(error) {
    if(Object.keys(error).length)
      this.setState({showError:true});

    this.setState({errors:error});
  }

  render() {
    return (
      <>
      <Notice icon="flaticon-warning kt-font-primary" style={{display: this.state.showError ? 'flex' : 'none' }}>
        {
          Object.keys(this.state.errors).map((key, index) => {
            return this.state.errors[key].map((error, i) => {
              console.log(error);
              return <li key={index+i}>{key.charAt(0).toUpperCase() + key.slice(1)} : {error}</li>
            });
          })
        }
        </Notice>
        <div className="row">
          <div className="col-md-12">
            <CustomHead
              beforeCodeTitle={"Wanted"}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  <Link to={"/"+USER_URL+"/wanted/asset"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                  </div>
                </div>
              </div>
            </div> }
            >
              <div className="kt-section">
                <Detail data={this.props} sendError={this.sendError} />
              </div>
            </CustomHead>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(DetailPage);