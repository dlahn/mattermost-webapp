// Copyright (c) 2017 Mattermost Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';

import {get} from 'mattermost-redux/selectors/entities/preferences';

import {getDirectTeammate} from 'utils/utils.jsx';
import {Constants, TutorialSteps, Preferences} from 'utils/constants.jsx';

import ChannelView from './channel_view.jsx';

function mapStateToProps(state, ownProps) {
    const channel = state.entities.channels.channels[state.entities.channels.currentChannelId];

    let deactivatedChannel = false;
    if (channel && channel.type === Constants.DM_CHANNEL) {
        const teammate = getDirectTeammate(channel.id);
        deactivatedChannel = teammate && teammate.delete_at;
    }

    return {
        ...ownProps,
        channelId: state.entities.channels.currentChannelId,
        deactivatedChannel,
        showTutorial: Number(get(state, Preferences.TUTORIAL_STEP, state.entities.users.currentUserId, 999)) <= TutorialSteps.INTRO_SCREENS
    };
}

export default connect(mapStateToProps)(ChannelView);
