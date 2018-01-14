import React from "react";

import Onboarding from "../onboarding";
import Jokes from "../jokes";

import Cache from "../../data/cache";

class Main extends React.Component {
  constructor() {
    super();
    this.state = { onboardingShown: false, jokes: [] };
  }

  componentWillMount() {
    Cache.get(Cache.keys.ONBOARDING).then(onboardingShown => {
      this.setState(() => ({ onboardingShown }));
    });
  }

  closeOnboarding(jokes) {
    this.setState(() => ({ onboardingShown: true, jokes }));
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