package in.hedera.motobite.reku.location;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStatusCodes;

/**
 * Created by reku on 12/8/16.
 */
public class GPStrackerModule extends ReactContextBaseJavaModule implements GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener, ActivityEventListener, LifecycleEventListener {
    private static final String LOG_TAG = GPStrackerModule.class.getSimpleName();
    private GoogleApiClient googleApiClient;
    private LocationRequest locationRequest;
    private Location location;
    private Promise mPromptPromise;

    public static boolean isLocationDialogShowing = false;

    private final int ACTIVITY_LOCATION_DIALOG_CODE = 100;
    private static final float MIN_ACCURACY = 100.0f;
    private static final float MIN_LAST_READ_ACCURACY = 500.0f;
    final private int REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS = 127;

    private static final String ERR_ACTIVITY_DOES_NOT_EXIST = "Activity doesn't exist";
    private static final String ERR_GOOGLE_API_NOT_INITIALIZED = "Google API client not initialized";
    private static final String ERR_SETTINGS_CHANGE_UNAVAILABLE = "Unable to change GPS settings";
    private static final String ERR_PROMPT_CANCELED = "Permission request was canceled";
    private static final String ERR_NO_LAST_LOCATION = "No last known location found";

    private static final String ERR_ACTIVITY_DOES_NOT_EXIST_CODE = "ERR_ACTIVITY_DOES_NOT_EXIST";
    private static final String ERR_GOOGLE_API_NOT_INITIALIZED_CODE = "ERR_GOOGLE_API_NOT_INITIALIZED";
    private static final String ERR_SETTINGS_CHANGE_UNAVAILABLE_CODE = "ERR_SETTINGS_CHANGE_UNAVAILABLE";
    private static final String ERR_PROMPT_CANCELED_CODE = "ERR_PROMPT_CANCELED";
    private static final String ERR_NO_LAST_LOCATION_CODE = "ERR_NO_LAST_LOCATION";

    public GPStrackerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.i(LOG_TAG, "Constructor called");
        reactContext.addActivityEventListener(this);
        reactContext.addLifecycleEventListener(this);

    }

    private final LocationListener mLocationListener = new LocationListener() {

        @Override
        public void onLocationChanged(Location location) {
            sendLocationUpdate(location);
        }
    };

    @Override
    public String getName() {
        return "MBLocAndroid";
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        Log.i(LOG_TAG, "on GoogleApiClient connected");


    }

    @Override
    public void onConnectionSuspended(int i) {
        Log.i(LOG_TAG, "on GoogleApiClient connection suspended");
    }


    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        Log.i(LOG_TAG, "On GoogleApiClient Connection failed");
    }

    @Override
    public void initialize() {
        super.initialize();

        Log.i(LOG_TAG, "initialized");
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            case ACTIVITY_LOCATION_DIALOG_CODE:
                // User was asked to enable the location setting.
                switch (resultCode) {
                    case Activity.RESULT_OK:
                        // All required changes were successfully made
                        Log.i(LOG_TAG, "user accepted to allow location");
                        resolvePromptPromise(true);
                        break;
                    case Activity.RESULT_CANCELED:
                        // The user was asked to change settings, but chose not to
                        Log.i(LOG_TAG, "user rejected to allow location");
                        rejectPromptPromise(ERR_PROMPT_CANCELED_CODE, ERR_PROMPT_CANCELED);
                        break;
                    default:
                        rejectPromptPromise(ERR_PROMPT_CANCELED_CODE, ERR_PROMPT_CANCELED);
                        break;
                }
                isLocationDialogShowing = false;
                break;
            default:
                break;

        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }

    @Override
    public void onHostResume() {
        Log.i(LOG_TAG, "onHostResume: ");
        buildGoogleApiClient();
        if (!googleApiClient.isConnected()) {
            googleApiClient.connect();
        }
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        Log.i(LOG_TAG, "onHostDestroy: ");
        if (googleApiClient.isConnected()) {
            LocationServices.FusedLocationApi.removeLocationUpdates(googleApiClient, mLocationListener);
            googleApiClient.disconnect();
        }
    }

    @ReactMethod
    public void echo() {

        Log.i(LOG_TAG, "echo called");
    }

    @ReactMethod
    public void connectGPS() {

        Log.d(LOG_TAG, "connectGPS: " + isGPSdisabled());
    }

    @ReactMethod
    public void requestEnableLocation(@Nullable final ReadableMap options, final Promise promise) {
        if (googleApiClient == null || !googleApiClient.isConnected()) {
            promise.reject(ERR_GOOGLE_API_NOT_INITIALIZED_CODE, ERR_GOOGLE_API_NOT_INITIALIZED);
            return;
        }

        final Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            rejectPromptPromise(ERR_ACTIVITY_DOES_NOT_EXIST_CODE, ERR_ACTIVITY_DOES_NOT_EXIST);
            return;
        }

        LocationRequest locationRequest = buildLocationRequest(options);

        LocationSettingsRequest request = new LocationSettingsRequest.Builder()
                .addLocationRequest(locationRequest)
                .setAlwaysShow(true)
                .build();

        PendingResult<LocationSettingsResult> result =
                LocationServices.SettingsApi.checkLocationSettings(googleApiClient, request);

        result.setResultCallback(new ResultCallback<LocationSettingsResult>() {
            @Override
            public void onResult(@NonNull LocationSettingsResult result) {
                final Status status = result.getStatus();

                switch (status.getStatusCode()) {
                    case LocationSettingsStatusCodes.SUCCESS:
                        promise.resolve(true);
                        break;
                    case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                        promise.reject(ERR_SETTINGS_CHANGE_UNAVAILABLE_CODE, ERR_SETTINGS_CHANGE_UNAVAILABLE);
                        break;
                    case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                        mPromptPromise = promise;

                        try {
                            status.startResolutionForResult(currentActivity, ACTIVITY_LOCATION_DIALOG_CODE);
                        } catch (IntentSender.SendIntentException e) {
                            rejectPromptPromise(e);
                        }
                        break;
                }
            }
        });
    }

    @ReactMethod
    public void getLastLocation(final Promise promise) {
        if (googleApiClient == null || !googleApiClient.isConnected()) {
            promise.reject(ERR_GOOGLE_API_NOT_INITIALIZED_CODE, ERR_GOOGLE_API_NOT_INITIALIZED);
            return;
        }
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject(ERR_ACTIVITY_DOES_NOT_EXIST_CODE, ERR_ACTIVITY_DOES_NOT_EXIST);
            return;
        }

        Location lastLocation;
        if (ActivityCompat.checkSelfPermission(currentActivity, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(currentActivity, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // Check Permissions here to request the missing permissions
            ActivityCompat.requestPermissions(currentActivity,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                    REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
            promise.reject(ERR_NO_LAST_LOCATION_CODE, ERR_NO_LAST_LOCATION);
            return;
        } else {
            lastLocation = LocationServices.FusedLocationApi.getLastLocation(
                    googleApiClient);
        }


        if (lastLocation != null) {
            promise.resolve(buildLocationMap(location));
        } else {
            promise.reject(ERR_NO_LAST_LOCATION_CODE, ERR_NO_LAST_LOCATION);
        }
    }

    @ReactMethod
    public void startWatching(final ReadableMap options) {

        if (googleApiClient == null || !googleApiClient.isConnected()) {
            sendLocationError(ERR_GOOGLE_API_NOT_INITIALIZED);
            return;
        }

        final Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            sendLocationError(ERR_ACTIVITY_DOES_NOT_EXIST_CODE);
            return;
        }

        if (ActivityCompat.checkSelfPermission(getCurrentActivity(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(getCurrentActivity(), Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // Check Permissions here to request the missing permissions
            ActivityCompat.requestPermissions(currentActivity,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                    REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
            //and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return;
        }
        LocationServices.FusedLocationApi.requestLocationUpdates(
                googleApiClient, buildLocationRequest(options), mLocationListener);
    }

    @ReactMethod
    public void stopWatching() {
        if (googleApiClient == null || !googleApiClient.isConnected()) {
            sendLocationError(ERR_GOOGLE_API_NOT_INITIALIZED);
            return;
        }

        LocationServices.FusedLocationApi.removeLocationUpdates(googleApiClient, mLocationListener);
    }
    protected synchronized void buildGoogleApiClient() {
        googleApiClient = new GoogleApiClient.Builder(getReactApplicationContext())
                .addApi(LocationServices.API)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .build();
    }

    private boolean isGPSdisabled() {
        boolean gps_enabled;
        try {
            LocationManager lm = (LocationManager) getCurrentActivity().getSystemService(Context.LOCATION_SERVICE);
            gps_enabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
        } catch (Exception ex) {
            ex.printStackTrace();
            gps_enabled = false;
        }
        return gps_enabled;
    }


    private void sendLocationUpdate(Location mlocation){
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("locationListenerUpdate", buildLocationMap(mlocation));
    }

    private void sendLocationError(String error) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("locationListenerError", error);
    }

    private WritableMap buildLocationMap(final Location loc) {
        WritableMap coords = Arguments.createMap();

        coords.putDouble("latitude", loc.getLatitude());
        coords.putDouble("longitude", loc.getLongitude());
        coords.putDouble("altitude", loc.getAltitude());
        coords.putDouble("accuracy", loc.getAccuracy());
        coords.putDouble("speed", loc.getSpeed());

        WritableMap map = Arguments.createMap();

        map.putMap("coords", coords);
        map.putDouble("timestamp", loc.getTime());

        return map;
    }

    private void resolvePromptPromise(boolean value) {
        if (mPromptPromise != null) {
            mPromptPromise.resolve(value);
            mPromptPromise = null;
        }
    }

    private void rejectPromptPromise(String code, String reason) {
        if (mPromptPromise != null) {
            mPromptPromise.reject(code, reason);
            mPromptPromise = null;
        }
    }

    private void rejectPromptPromise(Exception reason) {
        if (mPromptPromise != null) {
            mPromptPromise.reject(reason);
            mPromptPromise = null;
        }
    }

    private LocationRequest buildLocationRequest(final ReadableMap options) {
        int priority = LocationRequest.PRIORITY_LOW_POWER;

        LocationRequest locationRequest = LocationRequest.create();

        if (options != null) {
            if (options.hasKey("priority")) {
                switch (options.getString("priority")) {
                    case "high_accuracy":
                        priority = LocationRequest.PRIORITY_HIGH_ACCURACY;
                        break;
                    case "balanced_power":
                        priority = LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY;
                        break;
                    case "low_power":
                        priority = LocationRequest.PRIORITY_LOW_POWER;
                        break;
                    default:
                        priority = LocationRequest.PRIORITY_NO_POWER;
                }
            }

            if (options.hasKey("interval")) {
                locationRequest.setInterval(options.getInt("interval"));
            }

            if (options.hasKey("timeout")) {
                locationRequest.setMaxWaitTime(options.getInt("timeout"));
            }

            if (options.hasKey("frequency")) {
                locationRequest.setNumUpdates(options.getInt("frequency"));
            }

            if (options.hasKey("displacement")) {
                locationRequest.setSmallestDisplacement((float) options.getDouble("displacement"));
            }
        }

        locationRequest.setPriority(priority);

        return locationRequest;
    }

}
