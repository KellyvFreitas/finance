export default function PageHeader({ title, subtitle, breadcrumb, actions }) {
    return (
        <div className="page-header">
            <div className="page-header__title">
                {breadcrumb}
                <h1>{title}</h1>
                {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
            </div>
            {actions && <div className="page-header__actions">{actions}</div>}
        </div>
    );
}
