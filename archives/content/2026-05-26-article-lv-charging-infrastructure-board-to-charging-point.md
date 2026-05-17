# EV Charging Infrastructure: From LV Board to Charging Point

**Slug:** `lv-charging-infrastructure-board-to-charging-point`
**Category:** insights
**Published:** 2026-05-26
**Word count:** ~1,750
**Author:** Nexgen Engineering Team

---

## The EV Charging Problem

The EV charging conversation in commercial property is dominated by two things: the government mandate and the charger manufacturer's specification sheet. Both start at the car park. Neither starts at the LV board. The consequence is that properties are being quoted for EV charger installations that their electrical infrastructure cannot currently support — and nobody involved in the early discussion has flagged it, because nobody present had an incentive to raise the complication.

A 7kW AC charger — the standard workplace charging unit — draws a 32A single-phase supply. A 22kW AC charger draws 32A three-phase. An installation of 20 × 7kW chargers represents an additional 40kW of continuous electrical load: roughly equivalent to adding a medium-sized office floor of equipment to your building's electrical system, all of it potentially running simultaneously overnight. Whether your existing LV infrastructure can absorb that load — in what configuration, at what cost, within what programme — is an engineering question. It should be answered before a planning application is submitted, before a charger manufacturer is approached, and certainly before a cable route is excavated.

This article is a practical reference for commercial property managers, fleet managers, and facilities directors evaluating or specifying EV charging infrastructure. It covers what an LV assessment involves, what the common constraint scenarios look like in practice, and eight questions to answer before any charger installation is commissioned.

---

## What Needs to Happen First

**LV board capacity**

The main LV distribution board is the starting point for any EV infrastructure assessment. The fundamental question is available spare capacity: the difference between the board's rated current and the installation's current maximum demand. A board rated at 400A with a measured maximum demand of 340A has approximately 60A of theoretical spare capacity — enough for one or two 7kW chargers before demand management is considered. A board operating at 85–90% of its rated capacity has no meaningful spare capacity for additional continuous loads, and any charger installation requires either a new supply, a diversity management solution, or a board upgrade before a single charger can be specified.

**Load diversity and smart charging**

Maximum demand calculations in a commercial building account for diversity — the statistical expectation that not all loads operate at peak simultaneously. EV chargers do not behave like typical office equipment. Where vehicles charge overnight, multiple charger sessions overlap in the same window, eroding the diversity factor the distribution system was designed around. Smart charging (mandatory for chargers above 3.5kW under the EV Smart Charge Points Regulations 2021) manages this through demand scheduling — but the aggregate peak demand must still be within the LV infrastructure's capacity after smart charging is applied. The design needs to account for worst-case simultaneous demand, not just average load.

**Sub-metering and distribution architecture**

Commercial EV infrastructure typically requires dedicated sub-metering — for energy cost recovery, fleet reimbursement, tenant billing, or DNO reporting. Where workplace charging is offered as an employee benefit, HMRC guidelines require accurate metering to determine the taxable value of the charge provided. Sub-metering requirements determine the distribution board architecture: a dedicated EV charging distribution board, a sub-main cable from the main switchboard, metering equipment, and communication links to the charge point management system (CPMS). These are electrical infrastructure additions that need to be designed and installed — they are not incidental to the charger installation, they are a prerequisite for it.

**DNO engagement**

For aggregate installations above 69kW — approximately 10 × 7kW chargers operating simultaneously — formal notification to the DNO is required under Engineering Recommendation G99/G100. For larger commercial or industrial installations, the DNO may require a network capacity assessment before approving the connection: a process that can take several months and may result in a requirement for grid reinforcement, a connection upgrade, or a demand management agreement as a condition of consent. DNO engagement is the single most common cause of programme delay in commercial EV projects when it is started late.

**Cable routes and future provision**

Running sub-main cables from the LV switchroom to car park charging locations is often the largest single element of EV installation cost and programme. Cable routes through occupied buildings require fire-stopping at every penetration, coordination with other services, and access to areas that are not always straightforward in a live commercial building. Trenching across car park surfaces or landscaped areas requires planning and significant reinstatement that is often underestimated at the outset. A well-designed commercial EV infrastructure makes provision for future expansion at the design stage: a main EV charging board sized for ultimate charging capacity, pre-installed trunking and ducting to remote charging zones, and sufficient sub-main conductor capacity to serve future phases without reinforcement.

---

## 8 Pre-Commission Questions

1. What is the rated current of your main LV distribution board and what is your installation's current maximum demand? Available spare capacity is the baseline — if there is none, your options are a new supply, load management, or a board upgrade before any charger is specified.

2. Has your installation had an Electrical Installation Condition Report within the last five years? An EICR surfaces existing deficiencies that must be resolved before adding new continuous load. Proceeding without one means adding EV load to an infrastructure whose condition is unknown.

3. Does your site have a three-phase supply to the LV board? Three-phase supply is required for 22kW AC chargers. Single-phase sites are limited to 7kW per charger — and if the aggregate load exceeds board capacity, a supply upgrade may still be needed.

4. What is the distance from the LV switchroom to the proposed charger locations? Cable route length directly affects conductor sizing, voltage drop calculations, and installation cost. Charger zones in remote car parks can make cable routes a dominant cost driver.

5. Are there existing cable ducts, containment routes, or service trenches to the car park? Existing ducting eliminates groundworks. Its absence means trenching, reinstatement, and programme time — often the element that most surprises clients who have focused their planning on the charger cost.

6. Is your aggregate planned charging load above 69kW? Above this threshold, DNO notification under G99/G100 is required. Above approximately 100kW, a formal DNO connection application may apply — allow several months, and start the process before any programme commitment is made.

7. Do you need sub-metering for fleet cost recovery, tenant billing, or HMRC compliance? Sub-metering requirements determine the distribution board architecture and communications design — they affect how the main switchboard needs to be configured, not just where the charger sits in the car park.

8. Is any car park resurfacing or major access works already planned within the next 12–18 months? Installing EV cable ducts during planned groundworks is significantly more cost-effective than excavating a completed surface. If resurfacing is planned, design the EV ducting provision into that programme now.

---

## Key Takeaways

- An EV charger installation is an LV infrastructure project first — the charger is the last item specified, not the first; the LV board determines what is possible
- 20 × 7kW chargers adds 40kW of continuous load to your building — check board spare capacity before approaching any charger supplier or programme manager
- Smart charging is mandatory above 3.5kW and manages demand peaks, but does not eliminate them — aggregate peak demand must still be within infrastructure capacity after scheduling is applied
- DNO engagement for installations above 69kW can take several months — start it before making any programme commitments to stakeholders, not after
- Sub-metering requirements (fleet reimbursement, tenant billing, HMRC) are infrastructure design inputs that determine board architecture — they are not incidental to the charger installation
- Provision for future phases at the design stage — oversized EV board, pre-installed ducting — costs a fraction of retrospective reinforcement in a finished car park

---

## A Note From the Field

> "The question we hear most often is 'can we add chargers to our car park?' The correct first question is 'what can our LV board currently support?' The answer to the second question determines whether the first is straightforward or a full infrastructure project."
> — Nexgen Engineering Team, Commercial LV Specialists

---

## Commission the Assessment First

The commercial EV charging market has a structural communication problem. Charger manufacturers sell chargers. Charge point management software providers sell software. Installation companies quote installation. Very few parties in those conversations have an incentive to raise the LV infrastructure question early — because doing so complicates the sale, extends the programme, and may require work that the party raising it is not equipped to deliver. The consequence is that property managers and fleet managers are committing to EV programmes against a backdrop of infrastructure constraints they were not told about, discovering them mid-project when the cost and programme implications are at their worst.

The DHL Reading Distribution Hub project illustrates what an LV infrastructure designed with headroom looks like in practice. The 800A TPN main distribution board Nexgen installed isn't solely the power supply for today's conveyor systems — it is the electrical backbone that supports future load growth across the facility, including EV infrastructure as DHL electrifies its fleet operations. Infrastructure designed with future capacity in mind is always cheaper than infrastructure retrofitted under pressure. The principle applies as directly to a commercial car park as to a distribution warehouse.

The eight questions in this guide are a structured starting point, not a substitute for a full assessment. A commercial EV charging feasibility study by a qualified LV engineer — covering board capacity, DNO requirements, metering architecture, cable routes, and phasing strategy — costs a fraction of the downstream expense of identifying an infrastructure gap after a programme commitment has been made and a car park has been dug up. Commission the assessment before you commission the chargers.

---

*Cross-links: Article 1 (LV Infrastructure Guide), Article 2 (DHL Case Study), Article 3 (Why Cheap Costs More), Infographic 3 (EV Readiness Checklist — archives/diagrams/2026-05-17-ev-readiness-checklist-publish.png)*
