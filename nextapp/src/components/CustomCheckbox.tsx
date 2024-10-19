import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
type props = {
    LabelContent: String
}
export function LabelCheckBox({ LabelContent }: props) {
    return (
        <div>
            <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">{LabelContent}</Label>
            </div>
        </div>
    )
}
