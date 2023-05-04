import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

//redux
import { useSelector, useDispatch } from "react-redux";
import { getMailDetails } from '../../store/actions';

//SimpleBar
import SimpleBar from "simplebar-react";

// Rating
import Rating from "react-rating";

const MailDetails = () => {
    const dispatch = useDispatch();

    const { mailDetails } = useSelector((state) => ({
        mailDetails: state.Mailbox.mailDetails,
    }));

    useEffect(() => {
        dispatch(getMailDetails());
    }, [dispatch]);


    function sidebar() {
        var element = document.getElementsByTagName('body')[0];
        element.classList.add("email-detail-show");
    }
    return (
        <React.Fragment>
            <SimpleBar className="message-list-content mx-n4 px-4 message-list-scroll">
                <ul className="message-list">
                    {
                        mailDetails.map((item, key) => (
                            <li className={item.unread ? "unread" : null} key={key}>
                                <div className="col-mail col-mail-1">
                                    <div className="form-check checkbox-wrapper-mail fs-14">
                                        <input className="form-check-input" type="checkbox" value="" id={item.forId} />
                                        <label className="form-check-label" htmlFor={item.forId}></label>
                                    </div>
                                    <button type="button" className="btn avatar-xs p-0 favourite-btn fs-15 active">
                                        <Rating
                                            stop={1}
                                            emptySymbol="ri-star-fill text-muted"
                                            fullSymbol="ri-star-fill text-warning "
                                        />
                                    </button>
                                    <Link to="#" className="title">{item.name}</Link>
                                </div>
                                <div className="col-mail col-mail-2"
                                    onClick={() => sidebar()}
                                >
                                    <Link to="#" className="subject"> {item.badge ? <span className={"badge me-2 bg-" + item.badgeClass}>{item.badge}</span> : null} {item.subject} - <span className="teaser">{item.teaser}</span>
                                    </Link>
                                    <div className="date">{item.date}</div>
                                </div>
                            </li>
                        ))}
                </ul>
            </SimpleBar>
        </React.Fragment>
    );
};

export default MailDetails;