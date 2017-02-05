//
//  NotificationController.swift
//  Mensa WatchKit Extension
//
//  Created by Hans Knoechel on 2/5/2017.
//  Copyright (c) 2012-2017 by Hans Knoechel. All rights reserved.
//

import WatchKit
import Foundation


class NotificationController: WKUserNotificationInterfaceController {

    override init() {
        // Initialize variables here.
        super.init()
        
        // Configure interface objects here.
    }

    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }

    /*
    override func didReceive(_ localNotification: UILocalNotification, withCompletion completionHandler: @escaping (WKUserNotificationInterfaceType) -> Void) {
        // This method is called when a local notification needs to be presented.
        // Implement it if you use a dynamic notification interface.
        // Populate your dynamic notification interface as quickly as possible.
        //
        // After populating your dynamic notification interface call the completion block.
        completionHandler(.custom)
    }
    */
    
    /*
    override func didReceiveRemoteNotification(_ remoteNotification: [AnyHashable : Any], withCompletion completionHandler: @escaping (WKUserNotificationInterfaceType) -> Void) {
        // This method is called when a remote notification needs to be presented.
        // Implement it if you use a dynamic notification interface.
        // Populate your dynamic notification interface as quickly as possible.
        //
        // After populating your dynamic notification interface call the completion block.
        completionHandler(.custom)
    }
    */
}
