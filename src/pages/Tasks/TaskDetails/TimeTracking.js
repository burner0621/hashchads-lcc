import React from 'react';
import { Card, CardBody, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

import avatar10 from "../../../assets/images/users/avatar-10.jpg";
import avatar8 from "../../../assets/images/users/avatar-8.jpg";
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import { Link } from 'react-router-dom';

const TimeTracking = () => {
    return (
        <React.Fragment>

            <Card>
                <CardBody className="text-center">
                    <h6 className="card-title mb-3 flex-grow-1 text-start">Time Tracking</h6>
                    <div className="mb-2">
                        <lord-icon src="https://cdn.lordicon.com/kbtmbyzy.json" trigger="loop"
                            colors="primary:#405189,secondary:#02a8b5" style={{ width: "90px", height: "90px" }}>
                        </lord-icon>
                    </div>
                    <h3 className="mb-1">9 hrs 13 min</h3>
                    <h5 className="fs-14 mb-4">Profile Page Satructure</h5>
                    <div className="hstack gap-2 justify-content-center">
                        <button className="btn btn-danger btn-sm"><i className="ri-stop-circle-line align-bottom me-1"></i> Stop</button>
                        <button className="btn btn-success btn-sm"><i className="ri-play-circle-line align-bottom me-1"></i> Start</button>
                    </div>
                </CardBody>
            </Card>
            <Card className="mb-3">
                <CardBody>
                    <div className="mb-4">
                        <select className="form-control" name="choices-single-default" data-choices data-choices-search-false>
                            <option value="">Select Task board</option>
                            <option value="Unassigned">Unassigned</option>
                            <option value="To Do">To Do</option>
                            <option value="Inprogress">Inprogress</option>
                            <option defaultValue="In Reviews">In Reviews</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="table-card">
                        <table className="table mb-0">
                            <tbody>
                                <tr>
                                    <td className="fw-medium">Tasks No</td>
                                    <td>#VLZ456</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Tasks Title</td>
                                    <td>Profile Page Satructure</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Project Name</td>
                                    <td>Velzon - Admin Dashboard</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Priority</td>
                                    <td><span className="badge badge-soft-danger">High</span></td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Status</td>
                                    <td><span className="badge badge-soft-secondary">Inprogress</span></td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Due Date</td>
                                    <td>05 Jan, 2022</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="d-flex mb-3">
                        <h6 className="card-title mb-0 flex-grow-1">Assigned To</h6>
                        <div className="flex-shrink-0">
                            <button type="button" className="btn btn-soft-danger btn-sm" data-bs-toggle="modal" data-bs-target="#inviteMembersModal"><i className="ri-share-line me-1 align-bottom"></i> Assigned Member</button>
                        </div>
                    </div>
                    <ul className="list-unstyled vstack gap-3 mb-0">
                        <li>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <img src={avatar10} alt="" className="avatar-xs rounded-circle" />
                                </div>
                                <div className="flex-grow-1 ms-2">
                                    <h6 className="mb-1"><Link to="/pages-profile" className='text-body'>Tonya Noble</Link></h6>
                                    <p className="text-muted mb-0">Full Stack Developer</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <UncontrolledDropdown>
                                        <DropdownToggle tag="button" className="btn btn-icon btn-sm fs-16 text-muted dropdown shadow-none" type="button">
                                            <i className="ri-more-fill"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <div><DropdownItem><i className="ri-eye-fill text-muted me-2 align-bottom"></i>View</DropdownItem></div>
                                            <div><DropdownItem><i className="ri-star-fill text-muted me-2 align-bottom"></i>Favourite</DropdownItem></div>
                                            <div><DropdownItem><i className="ri-delete-bin-5-fill text-muted me-2 align-bottom"></i>Delete</DropdownItem></div>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <img src={avatar8} alt="" className="avatar-xs rounded-circle" />
                                </div>
                                <div className="flex-grow-1 ms-2">
                                    <h6 className="mb-1"><Link to="/pages-profile" className='text-body'>Thomas Taylor</Link></h6>
                                    <p className="text-muted mb-0">UI/UX Designer</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <UncontrolledDropdown>
                                        <DropdownToggle tag="button" className="btn btn-icon btn-sm fs-16 text-muted dropdown shadow-none" type="button">
                                            <i className="ri-more-fill"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <div><DropdownItem><i className="ri-eye-fill text-muted me-2 align-bottom"></i>View</DropdownItem></div>
                                            <div><DropdownItem><i className="ri-star-fill text-muted me-2 align-bottom"></i>Favourite</DropdownItem></div>
                                            <div><DropdownItem><i className="ri-delete-bin-5-fill text-muted me-2 align-bottom"></i>Delete</DropdownItem></div>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <img src={avatar2} alt="" className="avatar-xs rounded-circle" />
                                </div>
                                <div className="flex-grow-1 ms-2">
                                    <h6 className="mb-1"><Link to="/pages-profile" className='text-body'>Nancy Martino</Link></h6>
                                    <p className="text-muted mb-0">Web Designer</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <UncontrolledDropdown>
                                        <DropdownToggle tag="button" className="btn btn-icon btn-sm fs-16 text-muted dropdown shadow-none" type="button">
                                            <i className="ri-more-fill"></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <div><DropdownItem><i className="ri-eye-fill text-muted me-2 align-bottom"></i>View</DropdownItem></div>
                                            <div><DropdownItem><i className="ri-star-fill text-muted me-2 align-bottom"></i>Favourite</DropdownItem></div>
                                            <div><DropdownItem><i className="ri-delete-bin-5-fill text-muted me-2 align-bottom"></i>Delete</DropdownItem></div>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <Card>
                <CardBody>
                    <h5 className="card-title mb-3">Attachments</h5>
                    <div className="vstack gap-2">
                        <div className="border rounded border-dashed p-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm">
                                        <div className="avatar-title bg-light text-secondary rounded fs-24">
                                            <i className="ri-folder-zip-line"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="fs-13 mb-1"><Link to="#" className="text-body text-truncate d-block">App pages.zip</Link></h5>
                                    <div>2.2MB</div>
                                </div>
                                <div className="flex-shrink-0 ms-2">
                                    <div className="d-flex gap-1">
                                        <button type="button" className="btn btn-icon text-muted btn-sm fs-18 shadow-none"><i className="ri-download-2-line"></i></button>
                                        <UncontrolledDropdown>
                                            <DropdownToggle tag="button" className="btn btn-icon text-muted btn-sm fs-18 dropdown shadow-none" type="button">
                                                <i className="ri-more-fill"></i>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <li><DropdownItem><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Rename</DropdownItem></li>
                                                <li><DropdownItem><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</DropdownItem></li>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border rounded border-dashed p-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm">
                                        <div className="avatar-title bg-light text-secondary rounded fs-24">
                                            <i className="ri-file-ppt-2-line"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="fs-13 mb-1"><Link to="#" className="text-body text-truncate d-block">Velzon admin.ppt</Link></h5>
                                    <div>2.4MB</div>
                                </div>
                                <div className="flex-shrink-0 ms-2">
                                    <div className="d-flex gap-1">
                                        <button type="button" className="btn btn-icon text-muted btn-sm fs-18 shadow-none"><i className="ri-download-2-line"></i></button>
                                        <UncontrolledDropdown>
                                            <DropdownToggle tag="button" className="btn btn-icon text-muted btn-sm fs-18 dropdown shadow-none" type="button">
                                                <i className="ri-more-fill"></i>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <li><DropdownItem><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Rename</DropdownItem></li>
                                                <li><DropdownItem><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</DropdownItem></li>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border rounded border-dashed p-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-3">
                                    <div className="avatar-sm">
                                        <div className="avatar-title bg-light text-secondary rounded fs-24">
                                            <i className="ri-folder-zip-line"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                    <h5 className="fs-13 mb-1"><Link to="#" className="text-body text-truncate d-block">Images.zip</Link></h5>
                                    <div>1.2MB</div>
                                </div>
                                <div className="flex-shrink-0 ms-2">
                                    <div className="d-flex gap-1">
                                        <button type="button" className="btn btn-icon text-muted btn-sm fs-18 shadow-none"><i className="ri-download-2-line"></i></button>
                                        <UncontrolledDropdown>
                                            <DropdownToggle tag="button" className="btn btn-icon text-muted btn-sm fs-18 dropdown shadow-none" type="button">
                                                <i className="ri-more-fill"></i>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <li><DropdownItem><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Rename</DropdownItem></li>
                                                <li><DropdownItem><i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete</DropdownItem></li>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 text-center">
                            <button type="button" className="btn btn-success">View more</button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default TimeTracking;