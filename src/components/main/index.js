import React from "react";
import { NetInfo } from "react-native";

import Onboarding from "../onboarding";
import Jokes from "../jokes";

import Cache from "../../data/cache";

import Mixpanel from "../../utils/mixpanel";
import { fetchConnectionInfo } from "../../utils/network";

class Main extends React.Component {
  constructor() {
    super();
    this.state = { onboardingShown: false, jokes: [] };
  }

  componentWillMount() {
    Cache.get(Cache.keys.ONBOARDING).then(onboardingShown => {
      this.setState(() => ({ onboardingShown }));
      if (onboardingShown) {
        fetchConnectionInfo().then(connectionInfo => {
          Mixpanel.trackAppOpened(connectionInfo);
        });
      }
    });
  }

  closeOnboarding(jokes) {
    fetchConnectionInfo().then(connectionInfo => {
      Mixpanel.trackOnboardingCompleted(connectionInfo);
    });
    this.setState(() => ({ onboardingShown: true, jokes }));
    Cache.set(Cache.keys.ONBOARDING, true);
  }

  render() {
    if (this.state.onboardingShown) {
      return <Jokes jokes={this.state.jokes} />;
    }
    return (
      <Onboarding closeOnboarding={jokes => this.closeOnboarding(jokes)} />
    );
  }
}

export default Main;
