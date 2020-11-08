import React from "react";
import Notice from "../../../partials/content/Notice";
import CustomHead from "../../../partials/content/CustomHeader.js";
import {Button, Form, Col, Row} from "react-bootstrap";
import {
  FormControl, Select as SelectCore, IconButton,
} from "@material-ui/core";
import { Link, withRouter } from 'react-router-dom'
import {list, post, USER_URL, UNIT_MEASURES, PARTS_EXTRA_FIELDS} from "../../../crud/api";
import Select from 'react-select';
import DeleteIcon from '@material-ui/icons/Delete';


class Create extends React.Component {

  constructor(props) {
   super(props);
   this.state = { 
      validated: false, 
      part:{}, 
      selectedFile: null,
      countries:[],
      contacts:[],
      companies:[],
      users:[],
      conditions:[],
      releases:[],
      selected_primary_contact:{value:''},
      selected_owner:{value:''},
      selected_seller:{value:''},
      selected_user:{value:''},
      selected_release:{value:''},
      selected_unit_measure:{value:''},
      selected_condition:{value:''},
     partsExtraFields : PARTS_EXTRA_FIELDS,
     selectedExtraFieldsParts:[],
    };
    this.getDropdownsListing();
  }

  handleChange(event) {
    var part = this.state.part;
    var attr = event.target.name;
    var val = event.target.value;
    if(attr === 'is_active')
      val = parseInt(val);

    part[attr] = val;
    this.setState({part : part})
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    this.setState({ validated: true });
    if(!this.state.selectedFile)
      delete this.state.part.file;
    post('parts', this.state.part).then(
      (response) => {
        this.setState({part : response.data});
        this.props.data.history.push(this.state.action == 'save_new' ? this.clearForm("parts-form"):"/"+USER_URL+"/part/asset");
    }).catch(error => { 
        this.props.sendError(error.response.data);
    });
  }

  getDropdownsListing() {
    let dropdowns = {// when you have database dropdown like departments just put here
      // dbcolumn: api_endpoint
      primary_contact:'contacts',
      location: 'countries',
      owner:'companies',
      user:'users',
      condition:'conditions',
      release:'releases'
    }

    let duplicating_dropdowns = {
      companies: ['seller'],
    }

    let dropdown_keys = Object.keys(dropdowns);
    for(let key in dropdown_keys) {
      let params = {}
        list(dropdowns[dropdown_keys[key]], params).then(function(response){
            let data = response.data;
            let selected = {};
            for(let opt in data){
              // special case for contacts 
              if(dropdowns[dropdown_keys[key]] === 'contacts')
                data[opt].name = data[opt].first_name+' '+data[opt].last_name;
              else if(dropdowns[dropdown_keys[key]] === 'users')
                data[opt].name = data[opt].contact.first_name+' '+data[opt].contact.last_name;

              data[opt].label = data[opt].name;    
              data[opt].value = data[opt].id;   

              if(this.state.part[dropdown_keys[key]] != undefined && data[opt].id === this.state.part[dropdown_keys[key]].id)
                selected = data[opt]

              if(duplicating_dropdowns[dropdowns[dropdown_keys[key]]] != undefined) {
                for(let index in duplicating_dropdowns[dropdowns[dropdown_keys[key]]]) {
                  let duplicated_el = duplicating_dropdowns[dropdowns[dropdown_keys[key]]][index];
                  if(this.state.part[duplicated_el] != undefined && data[opt].id === this.state.part[duplicated_el].id)
                    this.setState({['selected_'+duplicated_el]:selected});
                }
              }
            }  

              console.log(selected);
            this.setState({[dropdowns[dropdown_keys[key]]]: data, ['selected_'+dropdown_keys[key]]:selected});

        }.bind(this));
    }
  }

  selectChange(value, key) {
    let part = this.state.part;
    part[key] = value.value;
    this.setState({ ['selected_'+key]: value, part: part});
  }

  setTab(event, tab) {
    document.getElementById('part-tabs-tab-'+tab).click();
  }
  clearForm = (id) => { 
    document.getElementById(id).reset();
    this.setState({selectedFile: null, previewFile: null});
  }

  selectMoreFields(event, key){
    let partsExtraFields = [...this.state.partsExtraFields];
    partsExtraFields.splice(event.target.selectedIndex -1,1);
    this.setState({ partsExtraFields : partsExtraFields });
    this.setState(state => {
      const selectedExtraFieldsParts = [...state.selectedExtraFieldsParts, key];
      return {
        selectedExtraFieldsParts,
      };
    });
  }

  removeExtraField(event, key, label){
    let partsExtraFields = [...this.state.partsExtraFields, {label: label, value: key}];
    this.setState({ partsExtraFields : partsExtraFields });
    let selectedExtraFieldsParts = this.state.selectedExtraFieldsParts;
    selectedExtraFieldsParts = selectedExtraFieldsParts.filter((val, i) => {
      return key !== val;
    })
    this.setState({ selectedExtraFieldsParts : selectedExtraFieldsParts });
  }

  render() {
    const { validated, part, selectedFile, selected_location, countries, selected_primary_contact,
      contacts, selected_owner, companies, selected_seller, selected_user, users, conditions,
      selected_condition, releases, selected_release, selected_unit_measure} = this.state;
    return (
      <Form
        noValidate
        id = "parts-form"
        onSubmit={e => this.handleSubmit(e)}
      >
        <Form.Row>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Part Number</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="part"
              name="part_number"
              defaultValue={part ? part.part_number:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Alternate Part Number</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="part"
              name="alternate_part_number"
              defaultValue={part ? part.alternate_part_number:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Condition</Form.Label>
            <Select
              value={selected_condition}
              model="condition"
              name="name"
              onChange={e => this.selectChange(e, 'condition')}
              options={conditions}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder=""
              model="part"
              name="quantity"
              defaultValue={part ? part.quantity:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
          <Form.Group as={Col} md="4" xs="12">
            <Form.Label>Primary Contact</Form.Label>
            <Select
              value={selected_primary_contact}
              model="primary_contact"
              name="name"
              onChange={e => this.selectChange(e, 'primary_contact')}
              options={contacts}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} xs="12">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows="5"
              required
              type="text"
              placeholder=""
              model="part"
              name="description"
              defaultValue={part ? part.description:''}
              onChange={e => this.handleChange(e)}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          {this.state.selectedExtraFieldsParts.includes("release") &&
          <Col sm="3">
            <Form.Group as={Row}>
              <Form.Label column sm="3" className="text-left">Release</Form.Label>
              <Col sm="6" lg="6">
                <Select
                    value={selected_release}
                    model="release"
                    name="name"
                    onChange={e => this.selectChange(e, 'release')}
                    options={releases}
                />
              </Col>
              <Col sm="2">
                <IconButton aria-label="delete" onClick={(e) => this.removeExtraField(e, 'release', 'Release')}>
                  <DeleteIcon/>
                </IconButton>
              </Col>
            </Form.Group>
          </Col>
          }
          {this.state.selectedExtraFieldsParts.includes("location") &&
          <Col sm="3">
            <Form.Group as={Row}>
              <Form.Label column sm="3" className="text-left">Location</Form.Label>
              <Col sm="6" lg="6">
                <Select
                    value={selected_location}
                    model="location"
                    name="name"
                    onChange={e => this.selectChange(e, 'location')}
                    options={countries}
                />
              </Col>
              <Col sm="2">
                <IconButton aria-label="delete" onClick={(e) => this.removeExtraField(e, 'location', 'Location')}>
                  <DeleteIcon/>
                </IconButton>
              </Col>
            </Form.Group>
          </Col>
          }
          {this.state.selectedExtraFieldsParts.includes("unit_measure") &&
          <Col sm="3">
            <Form.Group as={Row}>
              <Form.Label column sm="3" className="text-left">Unit Measure</Form.Label>
              <Col sm="6" lg="6">
                <Select
                    value={selected_unit_measure}
                    model="part"
                    name="unit_measure"
                    onChange={e => this.selectChange(e, 'unit_measure')}
                    options={UNIT_MEASURES}
                />
              </Col>
              <Col sm="2">
                <IconButton aria-label="delete"
                            onClick={(e) => this.removeExtraField(e, 'unit_measure', 'Unit Measure')}>
                  <DeleteIcon/>
                </IconButton>
              </Col>
            </Form.Group>
          </Col>
          }
          {this.state.selectedExtraFieldsParts.includes("price") &&
          <Col sm="3">
            <Form.Group as={Row}>
              <Form.Label column sm="3" className="text-left">Price</Form.Label>
              <Col sm="6" lg="6">
                <Form.Control
                    required
                    type="text"
                    placeholder=""
                    model="part"
                    name="price"
                    defaultValue={part ? part.price : ''}
                    onChange={e => this.handleChange(e)}
                />
              </Col>
              <Col sm="2">
                <IconButton aria-label="delete" onClick={(e) => this.removeExtraField(e, 'price', 'Price')}>
                  <DeleteIcon/>
                </IconButton>
              </Col>
            </Form.Group>
          </Col>
          }
        </Form.Row>
        <Form.Row>
          {this.state.selectedExtraFieldsParts.includes("owner") &&
          <Col sm="3">
            <Form.Group as={Row}>
              <Form.Label column sm="3" className="text-left">Owner</Form.Label>
              <Col sm="6" lg="6">
                <Select
                    value={selected_owner}
                    model="owner"
                    name="name"
                    onChange={e => this.selectChange(e, 'owner')}
                    options={companies}
                />
              </Col>
              <Col sm="2">
                <IconButton aria-label="delete" onClick={(e) => this.removeExtraField(e, 'owner', 'Owner')}>
                  <DeleteIcon/>
                </IconButton>
              </Col>
            </Form.Group>
          </Col>
          }
          {this.state.selectedExtraFieldsParts.includes("seller") &&
          <Col sm="3">
            <Form.Group as={Row}>
              <Form.Label column sm="3" className="text-left">Seller</Form.Label>
              <Col sm="6" lg="6">
                <Select
                    value={selected_seller}
                    model="seller"
                    name="name"
                    onChange={e => this.selectChange(e, 'seller')}
                    options={companies}
                />
              </Col>
              <Col sm="2">
                <IconButton aria-label="delete" onClick={(e) => this.removeExtraField(e, 'seller', 'Seller')}>
                  <DeleteIcon/>
                </IconButton>
              </Col>
            </Form.Group>
          </Col>
          }
        </Form.Row>
        <Form.Group as={Row}>
          <Col sm="2" lg="2" >
            <FormControl variant="outlined" fullWidth={true}>
              <SelectCore
                native
                value=""
                onChange={(e) => this.selectMoreFields(e, e.target.value)}
              >
                <option value="" disabled>Add more fields</option>
                {this.state.partsExtraFields.map(item => (
                    <option value={item.value} data-label={item.label}>{item.label}</option>
                ))}
              </SelectCore>
            </FormControl>
          </Col>
        </Form.Group>
        <Button type="submit" onClick={(e) => this.setState({action:'save'})} className="btn btn-primary">
          <i className="la la-save" />
          Save & Close
        </Button>
        &nbsp;&nbsp;

        <Button type="submit" onClick={(e) => this.setState({action:'save_new'})} className="btn btn-success">
          <i className="la la-save" />
          Save & New
        </Button>
        &nbsp;&nbsp;

        <Link to={"/"+USER_URL+"/part/asset"} className="btn btn-danger">
          <i className="la la-remove" />
          Cancel
        </Link>
      </Form>
    );
  }
}

class CreatePage extends React.Component {
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
              beforeCodeTitle={"Part"}
              jsCode =   {<div className="kt-portlet__head-toolbar">
              <div className="kt-portlet__head-wrapper">
                <div className="kt-portlet__head-actions">
                  <div className="dropdown dropdown-inline">
                  <Link to={"/"+USER_URL+"/part/asset"} className="btn btn-clean btn-icon-sm">
                        <i className="la la-long-arrow-left"></i>
                        Back
                      </Link>
                  </div>
                </div>
              </div>
            </div>
            }>
              <div className="kt-section">
                <Create data={this.props} sendError={this.sendError} />
              </div>
            </CustomHead>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(CreatePage);