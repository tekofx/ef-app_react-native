import Constants from "expo-constants";
import * as Analytics from "expo-firebase-analytics";
import { useEffect } from "react";
import * as Sentry from "sentry-expo";

import { captureException } from "../../sentryHelpers";
import { useAppSelector } from "../../store";

export const AnalyticsManager = () => {
    const user = useAppSelector((state) => state.authorization);
    const enabled = useAppSelector((state) => state.settingsSlice.analytics.enabled);

    useEffect(() => {
        Analytics.setAnalyticsCollectionEnabled(enabled).catch(captureException);
    }, [enabled]);

    useEffect(() => {
        Sentry.Native.setUser(
            user
                ? {
                      id: user.uid,
                      username: user.username,
                  }
                : null
        );
        Sentry.Native.setTag("appVersionCode", Constants.manifest?.android?.versionCode);

        Analytics.setUserId(user?.uid ?? null).catch(captureException);
        Analytics.setUserProperty("username", user?.username ?? null).catch(captureException);
    }, [user]);

    return null;
};
