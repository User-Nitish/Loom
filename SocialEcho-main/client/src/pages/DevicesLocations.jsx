import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TrustedDevicesLocations from "../components/profile/TrustedDevicesLocations";
import PrimaryDevicesLocations from "../components/profile/PrimaryDevicesLocations";
import BlockedDevicesLocations from "../components/profile/BlockedDevicesLocations";
import CommonLoading from "../components/loader/CommonLoading";

import {
  getTrustedContextAuthDataAction,
  getUserPreferencesAction,
  getBlockedAuthContextDataAction,
  getContextAuthDataAction,
} from "../redux/actions/authActions";

const DevicesLocations = () => {
  const dispatch = useDispatch();
  const [dateFetched, setDateFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getUserPreferencesAction());
      await dispatch(getContextAuthDataAction());
      await dispatch(getTrustedContextAuthDataAction());
      await dispatch(getBlockedAuthContextDataAction());
    };
    fetchData().then(() => setDateFetched(true));
  }, [dispatch, dateFetched]);

  const userPreferences = useSelector((state) => state.auth?.userPreferences);
  const contextAuthData = useSelector((state) => state.auth?.contextAuthData);
  const trustedAuthContextData = useSelector(
    (state) => state.auth?.trustedAuthContextData
  );
  const blockedContextAuthData = useSelector(
    (state) => state.auth?.blockedAuthContextData
  );

  if (!dateFetched) {
    return (
      <div className="col-span-2 flex items-center justify-center h-screen">
        <CommonLoading />
      </div>
    );
  }

  if (!userPreferences || !contextAuthData) {
    return (
      <div className="bg-white border p-5 text-gray-700 text-center main-section">
        <p className="text-lg font-semibold mb-4">
          Context-based authentication is currently disabled for your account.
        </p>
        <p className="text-sm">
          By enabling context-based authentication, you will gain control over
          your devices, their locations, and manage trusted and blocked devices.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Neural Security</h1>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Active Device & Location Matrix</p>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent hidden md:block" />
      </div>

      <div className="space-y-10">
        <PrimaryDevicesLocations contextAuthData={contextAuthData} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-[40px] border border-white/5 p-8 bg-white/[0.01]">
            <TrustedDevicesLocations
              trustedAuthContextData={trustedAuthContextData}
            />
          </div>
          <div className="glass-card rounded-[40px] border border-white/5 p-8 bg-white/[0.01]">
            <BlockedDevicesLocations
              blockedContextAuthData={blockedContextAuthData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevicesLocations;
