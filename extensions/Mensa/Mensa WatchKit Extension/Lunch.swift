//
//  Lunch.swift
//  Mensa
//
//  Created by Hans Knoechel on 05.02.17.
//  Copyright © 2017 Appcelerator, Inc. All rights reserved.
//

import WatchKit

open class Lunch : NSObject {
    
    // MARK: Properties
    var name: String!
    var images: Array<String>!
    var additivesDescription: String! {
        get {
            let prefix: NSString = additives == nil || additives.count == 0 ? "Kein" : additives.count == 1 ? "Ein" : ""
            return prefix.length == 0 ? "\(additives.count) Zusätze" : "\(prefix) Zusatz"
        }
        set {
            self.additivesDescription = newValue
        }
    }
    var rawValue: NSDictionary!
    var price: String!
    var additives: Array<String>!
    
    /**
     Initializes the model with it's properties
     
     - parameter dictionary: The serialized lunch dictionary
     */
    init(dictionary: NSDictionary) {
        
        super.init()
        self.name = dictionary.object(forKey: "name") as! String
        
        if let _additives = dictionary["additives"] {
            if _additives is NSNull || _additives is NSDictionary {
                self.additives = []
            } else {
                self.additives = _additives as! Array<String>
            }
        }
        self.images = dictionary.object(forKey: "images") as! Array
        self.rawValue = dictionary
        
        let _price = self.rawValue["priceStudent"] as! String
        let priceArr = _price.characters.split{$0 == " "}.map(String.init)
        self.price = priceArr[0]
    }
    
    func formatPrice(_ _price: String) -> NSNumber {
        let priceArr = _price.characters.split{$0 == " "}.map(String.init)
        
        return NumberFormatter().number(from: priceArr[0])!
    }
}
