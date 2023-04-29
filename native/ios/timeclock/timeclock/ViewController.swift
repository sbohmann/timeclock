//
//  ViewController.swift
//  timeclock
//
//  Created by Sebastian Bohmann on 28.04.23.
//

import UIKit

class ViewController: UIViewController {
    @IBOutlet weak var links: UIStackView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        links.alignment = .fill
        links.distribution = .fillEqually
        links.spacing = 0.0
        let exampleButton = UIButton()
        exampleButton.setTitle("Example", for: .normal)
        exampleButton.backgroundColor = .systemBlue
//        exampleButton.
//        exampleButton.translatesAutoresizingMaskIntoConstraints = false
//        exampleButton.frame.size = CGSize(width: 100, height: 100)
        print(links.arrangedSubviews.count)
        links.insertArrangedSubview(exampleButton, at: 1)
        print(links.arrangedSubviews.count)
//        links.addArrangedSubview(exampleButton)
//        print(links.arrangedSubviews.count)
        links.backgroundColor = .yellow
    }
}
