//
//  InterfaceController.swift
//  Mensa WatchKit Extension
//
//  Created by Hans Knoechel on 2/5/2017.
//  Copyright (c) 2012-2017 by Hans Knoechel. All rights reserved.
//

import WatchKit
import WatchConnectivity
import Foundation

class InterfaceController: WKInterfaceController, WCSessionDelegate {

    @IBOutlet var tableView: WKInterfaceTable!
    var lunches: [Lunch]!
    
    override init() {
        super.init()
        
        if WCSession.isSupported() {
            let session = WCSession.default()
            session.delegate = self
            session.activate()
        }
    }

    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
        
        var request: URLRequest = URLRequest(url: URL(string:"https://api.studentenfutter-os.de/lunches/list/2017-02-06/0")!)
        request.addValue("Basic xxxxx", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request, completionHandler: {(data: Data?, response: URLResponse?, error: Error?) in
            let httpResponse: HTTPURLResponse = response as! HTTPURLResponse
            
            if  httpResponse.statusCode == 200 {
                do {
                    let data: [NSDictionary] = try JSONSerialization.jsonObject(with: data!, options: .allowFragments) as! [NSDictionary]
                    for lunch: NSDictionary in data {
                        self.lunches.append(Lunch(dictionary: lunch))
                    }
                } catch {
                    print("🙉 Error: Cannot parse response!")
                }
            } else {
                print("🙉 Error: Wrong HTTP response: \(httpResponse.statusCode)")
            }
            
            DispatchQueue.main.async(execute: {
                self.refreshUI()
            })
        })

        /*WCSession.default().sendMessage(["action": "getLunches"], replyHandler: {(response: [String: Any]) -> Void in
            self.tableView.setNumberOfRows(3, withRowType: "LunchCell")
            
            let row: LunchCell = self.tableView.rowController(at: 0) as! LunchCell
            row.titleLabel.setText("Spaghetti")
            row.subtitleLabel.setText("13.37 €")
            
        }, errorHandler: {(error: Error) -> Void in
            self.tableView.setNumberOfRows(1, withRowType: "LunchCell")
            
            let row: LunchCell = self.tableView.rowController(at: 0) as! LunchCell
            row.titleLabel.setText("No lunches found today!")
        })*/
    }
    
    func refreshUI() {
        self.tableView.setRowTypes(["LunchCell"])
        self.tableView.setNumberOfRows(lunches.count, withRowType: "LunchCell")
        
        for lunch: Lunch in lunches {
            let row: LunchCell = self.tableView.rowController(at: 0) as! LunchCell
            
            row.titleLabel.setText(lunch.name)
            row.subtitleLabel.setText("\(lunch.price) €")
        }
    }

    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }
    
    func session(_ session: WCSession, didReceiveMessage message: [String : Any]) {
        
    }

    @available(watchOS 2.2, *)
    public func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        // This will be called when the activation of a session finishes.
    }

}
