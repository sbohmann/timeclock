import UIKit

class ViewController: UIViewController {
    @IBOutlet weak var content: UIStackView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        addButton("List", openList)
    }
    
    func addButton(_ name: String, _ action: () -> Void) {
        let button = UIButton(type: .system)
        button.setTitle(name, for: .normal)
        button.addAction(UIAction { _ in self.openList() }, for: .touchUpInside)
        content.addArrangedSubview(button)
    }
    
    func openList() {
        print("Would open list")
    }
}
