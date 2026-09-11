import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
    return (
        <Card flush>
            <EmptyState
                icon={Compass}
                title="Página não encontrada"
                description="O endereço acessado não existe ou o contrato foi removido."
                action={
                    <Link to="/" className="btn btn--primary" style={{ marginTop: 8 }}>
                        Voltar para a visão geral
                    </Link>
                }
            />
        </Card>
    );
}
