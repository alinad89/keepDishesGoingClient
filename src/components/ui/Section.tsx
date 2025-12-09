import './Section.css'

interface SectionProps {
  title?: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
  centered?: boolean
}

function Section({ title, subtitle, children, className = '', centered = false }: SectionProps) {
  return (
    <section className={`section ${className}`.trim()}>
      {(title || subtitle) && (
        <div className={`section-header ${centered ? 'centered' : ''}`.trim()}>
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="section-content">
        {children}
      </div>
    </section>
  )
}

export default Section
