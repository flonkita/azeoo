package com.rn_host_app;

import android.app.Activity;
import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import io.flutter.embedding.android.FlutterActivity;

public class FlutterModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public FlutterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "FlutterModule";
    }

    @ReactMethod
    public void openProfile(String userId) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null)
            return;

        // On lance l'activité Flutter standard
        // Plus tard, on pourra passer l'userId via un MethodChannel ou des arguments
        Intent intent = FlutterActivity
                .withNewEngine()
                .initialRoute("/")
                .build(currentActivity);

        currentActivity.startActivity(intent);
    }
}