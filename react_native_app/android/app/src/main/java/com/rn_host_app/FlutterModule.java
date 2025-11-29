package com.rn_host_app;

import android.app.Activity;
import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import io.flutter.embedding.android.FlutterActivity;
import io.flutter.embedding.engine.FlutterEngine;
import io.flutter.embedding.engine.FlutterEngineCache;
import io.flutter.embedding.engine.dart.DartExecutor;
import io.flutter.plugin.common.MethodChannel;

public class FlutterModule extends ReactContextBaseJavaModule {

    private static final String ENGINE_ID = "my_engine_id";

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
        // On récupère l'activité courante
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity == null)
            return;

        // 👇 LE FIX EST ICI : On oblige Android à exécuter ça sur le Thread Principal
        currentActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    // 1. Initialisation du moteur (Cache)
                    FlutterEngine flutterEngine = FlutterEngineCache.getInstance().get(ENGINE_ID);

                    if (flutterEngine == null) {
                        flutterEngine = new FlutterEngine(reactContext); // Utilise reactContext ou currentActivity
                        flutterEngine.getDartExecutor().executeDartEntrypoint(
                                DartExecutor.DartEntrypoint.createDefault());
                        FlutterEngineCache.getInstance().put(ENGINE_ID, flutterEngine);
                    }

                    // 2. Lancement de l'écran
                    Intent intent = FlutterActivity
                            .withCachedEngine(ENGINE_ID)
                            .build(currentActivity);

                    currentActivity.startActivity(intent);

                    // 3. Envoi de l'ID via le canal
                    new MethodChannel(flutterEngine.getDartExecutor().getBinaryMessenger(), "com.azeoo/profile")
                            .invokeMethod("setUserId", userId);

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
}