// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import $ from 'jquery';

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import * as UserAgent from 'utils/user_agent.jsx';
import * as Utils from 'utils/utils.jsx';

import deferComponentRender from 'components/deferComponentRender';

import ChannelHeader from 'components/channel_header';
import CreatePost from 'components/create_post.jsx';
import FileUploadOverlay from 'components/file_upload_overlay.jsx';
import PostView from 'components/post_view';
import TutorialView from 'components/tutorial/tutorial_view.jsx';

export default class ChannelView extends React.Component {
    static propTypes = {

        /**
         * ID of the channel to display
         */
        channelId: PropTypes.string.isRequired,

        /**
         * Set if this channel is deactivated, primarily used for DMs with inactive users
         */
        deactivatedChannel: PropTypes.bool.isRequired,

        /**
         * Set to show the tutorial
         */
        showTutorial: PropTypes.bool.isRequired,

        /**
         * React router params
         */
        params: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.createDeferredPostView();
    }

    createDeferredPostView = () => {
        this.deferredPostView = deferComponentRender(
            PostView,
            <div id='post-list'/>
        );
    }

    componentDidMount() {
        $('body').addClass('app__body');

        // IE Detection
        if (UserAgent.isInternetExplorer() || UserAgent.isEdge()) {
            $('body').addClass('browser--ie');
        }
    }

    componentWillUnmount() {
        $('body').removeClass('app__body');
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.channelId !== nextProps.channelId) {
            this.createDeferredPostView();
        }
    }

    shouldComponentUpdate(nextProps) {
        if (!Utils.areObjectsEqual(nextProps.params, this.props.params)) {
            return true;
        }

        if (nextProps.channelId !== this.props.channelId) {
            return true;
        }

        if (nextProps.deactivatedChannel !== this.props.deactivatedChannel) {
            return true;
        }

        return false;
    }

    getChannelView = () => {
        return this.refs.channelView;
    }

    render() {
        if (this.props.showTutorial) {
            return (
                <TutorialView
                    isRoot={false}
                />
            );
        }

        let createPost;
        if (this.props.deactivatedChannel) {
            createPost = (
                <div
                    className='post-create-message'
                >
                    <FormattedMessage
                        id='create_post.deactivated'
                        defaultMessage='You are viewing an archived channel with a deactivated user.'
                    />
                </div>
            );
        } else {
            createPost = (
                <div
                    className='post-create__container'
                    id='post-create'
                >
                    <CreatePost
                        getChannelView={this.getChannelView}
                    />
                </div>
            );
        }

        const DeferredPostView = this.deferredPostView;

        return (
            <div
                ref='channelView'
                id='app-content'
                className='app__content'
            >
                <FileUploadOverlay overlayType='center'/>
                <ChannelHeader
                    channelId={this.props.channelId}
                />
                <DeferredPostView
                    channelId={this.props.channelId}
                />
                {createPost}
            </div>
        );
    }
}